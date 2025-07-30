import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, MicOff, Volume2, VolumeX, Glasses } from 'lucide-react';
import { createRipple } from '@/utils/animations';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  transcript: string;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  toggleVoiceEnabled: () => void;
  stopSpeaking: () => void;
  resetTranscript: () => void;
  handsFreeMode: boolean;
  toggleHandsFreeMode: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isListening,
  toggleListening,
  transcript,
  isSpeaking,
  voiceEnabled,
  toggleVoiceEnabled,
  stopSpeaking,
  resetTranscript,
  handsFreeMode,
  toggleHandsFreeMode
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (transcript && isListening) {
      setMessage(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      resetTranscript();
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="glass p-4 rounded-2xl mx-4 mb-4 flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={handsFreeMode ? "Hands-free mode active - speak to chat..." : "Type your message..."}
        className="flex-1 bg-transparent border-none outline-none resize-none min-h-[40px] max-h-[120px] text-foreground placeholder:text-muted-foreground"
        disabled={isLoading || handsFreeMode}
        rows={1}
      />
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`relative ripple-container rounded-full ${isListening ? 'bg-red-100 text-red-500' : ''} animate-press`}
          onClick={(e) => {
            createRipple(e);
            toggleListening();
          }}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          {isListening && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle"></span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={`relative ripple-container rounded-full ${handsFreeMode ? 'bg-purple-100 text-purple-500' : ''} animate-press`}
          onClick={(e) => {
            createRipple(e);
            toggleHandsFreeMode();
          }}
          title={handsFreeMode ? "Disable hands-free mode" : "Enable hands-free mode"}
        >
          <Glasses className="h-5 w-5" />
          {handsFreeMode && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-500 animate-pulse-subtle"></span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="relative ripple-container rounded-full animate-press"
          onClick={(e) => {
            createRipple(e);
            if (isSpeaking) {
              stopSpeaking();
            } else {
              toggleVoiceEnabled();
            }
          }}
          title={isSpeaking ? "Stop speaking" : (voiceEnabled ? "Disable voice" : "Enable voice")}
        >
          {isSpeaking ? (
            <VolumeX className="h-5 w-5 text-red-500" />
          ) : (
            <Volume2 className={`h-5 w-5 ${!voiceEnabled ? 'text-muted-foreground' : ''}`} />
          )}
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className="relative ripple-container rounded-full"
          onClick={(e) => {
            createRipple(e);
            handleSendMessage();
          }}
          disabled={(!message.trim() && !transcript) || isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
