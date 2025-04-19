
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ollamaService } from '@/services/ollamaService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import ModelSelector from '@/components/ModelSelector';
import { LOCAL_MODEL_CONFIGS } from '@/services/ai/types';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

const LocalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(Object.keys(LOCAL_MODEL_CONFIGS)[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of message list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
      const response = await ollamaService.generateResponse(selectedModel, input);

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
        content: 'Sorry, something went wrong. Please try again.',
        role: 'assistant',
        timestamp: Date.now(),
      }]);
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Local AI Chat</h2>
        <p className="text-sm text-muted-foreground">
          Connect to your local Ollama instance running at http://127.0.0.1:11434
        </p>
        <div className="mt-2">
          <ModelSelector 
            value={selectedModel} 
            onChange={setSelectedModel} 
          />
        </div>
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
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
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
