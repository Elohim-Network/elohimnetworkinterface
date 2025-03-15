
import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  previousRole?: string;
  onMount?: () => void;
  speak?: (text: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  previousRole,
  onMount,
  speak
}) => {
  const { role, content, isLoading } = message;
  const messageRef = useRef<HTMLDivElement>(null);
  const isFirstInGroup = previousRole !== role;
  
  // When message appears, scroll into view and potentially speak (AI responses)
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
      
      if (onMount) {
        onMount();
      }
      
      // Speak assistant messages that aren't loading
      if (role === 'assistant' && !isLoading && speak && content) {
        speak(content);
      }
    }
  }, [content, isLoading, role, onMount, speak]);
  
  const isUser = role === 'user';
  
  return (
    <div
      ref={messageRef}
      className={cn(
        "py-2 px-4 animate-fade-in flex",
        isUser ? "justify-end" : "justify-start",
        isFirstInGroup ? "mt-4" : "mt-1"
      )}
    >
      <div
        className={cn(
          "py-3 px-4 rounded-2xl max-w-[85%] md:max-w-[70%]",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "glass rounded-tl-none"
        )}
      >
        {isLoading ? (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
