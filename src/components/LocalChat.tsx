
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ollamaService } from '@/services/localAiService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, AlertCircle } from 'lucide-react';
import ModelSelector from '@/components/ModelSelector';
import { LOCAL_MODEL_CONFIGS } from '@/services/ai/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getConfig } from '@/services/ai/config';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

const AGENT_ELOHIM_SYSTEM_PROMPT = 
  "You are Agent Elohim, a helpful AI assistant with access to local models. " +
  "You have knowledge on various topics and can assist with a wide range of tasks. " +
  "As Agent Elohim, you are friendly, informative, and strive to provide accurate and helpful responses. " +
  "If you don't know something, admit it rather than making up information.";

const LocalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(Object.keys(LOCAL_MODEL_CONFIGS)[0]);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of message list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const config = getConfig();
      setConnectionStatus('unknown');
      
      // Simple connection test
      const response = await fetch(`${config.mistralUrl}/api/generate`, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);
      
      if (response && response.ok) {
        setConnectionStatus('connected');
        // Add welcome message if no messages
        if (messages.length === 0) {
          setMessages([{
            id: `msg-${Date.now()}-assistant`,
            content: "Hello, I'm Agent Elohim. I'm connected to your local Mistral 7B model. How can I assist you today?",
            role: 'assistant',
            timestamp: Date.now(),
          }]);
        }
      } else {
        setConnectionStatus('error');
        if (messages.length === 0) {
          setMessages([{
            id: `msg-${Date.now()}-assistant`,
            content: "I couldn't connect to your local Ollama instance. Please make sure it's running and try again.",
            role: 'assistant',
            timestamp: Date.now(),
          }]);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setConnectionStatus('error');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content: input,
      role: 'user',
      timestamp: Date.now(),
    };

    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create placeholder for assistant response
      const placeholderId = `msg-${Date.now()}-assistant`;
      const placeholderMessage: Message = {
        id: placeholderId,
        content: '...',
        role: 'assistant',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, placeholderMessage]);

      // Get response from service
      const response = await ollamaService.generateResponse(
        selectedModel, 
        input,
        AGENT_ELOHIM_SYSTEM_PROMPT
      );

      // Update placeholder with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { ...msg, content: response } 
          : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-error`,
        content: 'Sorry, something went wrong connecting to your local Agent Elohim. Please check your Ollama server and try again.',
        role: 'assistant',
        timestamp: Date.now(),
      }]);
      
      // Try to reconnect
      checkConnectionStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetryConnection = () => {
    checkConnectionStatus();
    toast.info("Checking connection to local Ollama server...");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Local Agent Elohim</h2>
            <p className="text-sm text-muted-foreground">
              Connect to your local Ollama instance running at http://127.0.0.1:11434
            </p>
          </div>
          <Button 
            variant={connectionStatus === 'connected' ? "outline" : "default"}
            size="sm"
            onClick={handleRetryConnection}
            className={connectionStatus === 'connected' ? "border-green-500 text-green-500" : ""}
          >
            {connectionStatus === 'connected' ? "Connected" : "Check Connection"}
          </Button>
        </div>
        
        <div className="mt-2">
          <ModelSelector 
            value={selectedModel} 
            onChange={setSelectedModel} 
          />
        </div>
        
        {connectionStatus === 'error' && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Unable to connect to your local Ollama instance. Please ensure it's running at http://127.0.0.1:11434
              or update the connection settings in the Connections tab.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 min-h-[80px]"
            disabled={isLoading || connectionStatus === 'error'}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || connectionStatus === 'error'}
            className="self-end"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocalChat;
