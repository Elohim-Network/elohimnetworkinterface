import { useState, useEffect, useCallback } from 'react';
import { Message, ChatSession, MessageRole } from '@/types/chat';
import { generateTextWithMistral, generateImageWithStableDiffusion } from '@/services/localAiService';

// Mock data for initial development until backend integration
const MOCK_INITIAL_MESSAGE: Message = {
  id: '1',
  content: "Hello, I'm Agent Elohim. How can I assist you today? I'm connected to your local Mistral 7B and Stable Diffusion models.",
  role: 'assistant',
  timestamp: Date.now()
};

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize or load from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('chat-sessions');
    const savedCurrentSessionId = localStorage.getItem('current-session-id');
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    
    if (savedCurrentSessionId) {
      setCurrentSessionId(savedCurrentSessionId);
    } else {
      // Create a new session if none exists
      createNewSession();
    }
  }, []);

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chat-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Save current session ID to localStorage when it changes
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('current-session-id', currentSessionId);
    }
  }, [currentSessionId]);

  // Create a new chat session
  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Conversation',
      messages: [MOCK_INITIAL_MESSAGE],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);

  // Get the current session
  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  // Process commands to detect image generation requests
  const processCommand = useCallback((content: string) => {
    const isImageRequest = content.toLowerCase().includes('/image') || 
                          content.toLowerCase().includes('generate image') ||
                          content.toLowerCase().includes('create image');
                          
    return {
      isImageRequest,
      prompt: isImageRequest 
        ? content.replace(/\/image|generate image|create image/i, '').trim()
        : content
    };
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentSessionId) return;
    
    // Create user message
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: Date.now()
    };
    
    // Add user message to the session
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? {
            ...session,
            messages: [...session.messages, userMessage],
            updatedAt: Date.now()
          }
        : session
    ));
    
    // Add loading message for AI response
    const pendingAiMessage: Message = {
      id: generateId(),
      content: '',
      role: 'assistant',
      timestamp: Date.now(),
      isLoading: true
    };
    
    setIsLoading(true);
    
    // Add AI loading message
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? {
            ...session,
            messages: [...session.messages, userMessage, pendingAiMessage],
            updatedAt: Date.now()
          }
        : session
    ));
    
    try {
      // Check if this is an image generation request
      const { isImageRequest, prompt } = processCommand(content);
      
      let response;
      if (isImageRequest) {
        // Generate image with Stable Diffusion
        response = await generateImageWithStableDiffusion(prompt);
        
        // If response starts with data:image, it's a successful image generation
        if (response.startsWith('data:image')) {
          response = `![Generated Image](${response})`;
        }
      } else {
        // Generate text with Mistral
        const chatHistory = currentSession?.messages
          .filter(msg => !msg.isLoading)
          .map(msg => ({ role: msg.role, content: msg.content })) || [];
          
        // Add the current user message
        chatHistory.push({ role: 'user', content });
        
        response = await generateTextWithMistral(chatHistory);
      }
      
      // Update the AI message with actual content
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? {
              ...session,
              messages: session.messages.map(msg => 
                msg.id === pendingAiMessage.id
                  ? {
                      ...msg,
                      content: response,
                      isLoading: false
                    }
                  : msg
              ),
              updatedAt: Date.now()
            }
          : session
      ));
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Update with error message
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? {
              ...session,
              messages: session.messages.map(msg => 
                msg.id === pendingAiMessage.id
                  ? {
                      ...msg,
                      content: 'Sorry, I encountered an error while processing your request. Please ensure your local AI models are running correctly.',
                      isLoading: false
                    }
                  : msg
              ),
              updatedAt: Date.now()
            }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, currentSession, processCommand]);

  // Mock response generator (temporary until AI integration)
  const getMockResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm Agent Elohim. I'm here to assist you with your tasks and answer your questions. How can I help you today?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return "I can help you with various tasks such as answering questions, scheduling tasks, summarizing information, or connecting with other systems. Just let me know what you need assistance with!";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    return "I understand you're interested in exploring this topic further. As Agent Elohim, I'm designed to assist you with comprehensive insights and actionable steps. Could you provide more details about what specific aspects you'd like to focus on?";
  };

  // Switch to a different session
  const switchSession = useCallback((sessionId: string) => {
    if (sessions.some(s => s.id === sessionId)) {
      setCurrentSessionId(sessionId);
    }
  }, [sessions]);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    // If deleting the current session, switch to another or create new
    if (sessionId === currentSessionId) {
      if (sessions.length > 1) {
        const otherSession = sessions.find(s => s.id !== sessionId);
        if (otherSession) {
          setCurrentSessionId(otherSession.id);
        }
      } else {
        createNewSession();
      }
    }
  }, [currentSessionId, sessions, createNewSession]);

  // Rename a session
  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title: newTitle }
        : session
    ));
  }, []);

  // Clear a session's messages except the initial one
  const clearSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            messages: [MOCK_INITIAL_MESSAGE],
            updatedAt: Date.now() 
          }
        : session
    ));
  }, []);

  return {
    sessions,
    currentSession,
    isLoading,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    renameSession,
    clearSession
  };
}
