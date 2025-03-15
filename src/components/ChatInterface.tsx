
import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useVoice } from '@/hooks/useVoice';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import VoiceControl from '@/components/VoiceControl';
import { Message } from '@/types/chat';

const ChatInterface: React.FC = () => {
  const { 
    sessions, 
    currentSession, 
    isLoading, 
    sendMessage, 
    createNewSession, 
    switchSession, 
    deleteSession 
  } = useChat();
  
  const {
    isListening,
    transcript,
    isSpeaking,
    voiceEnabled,
    toggleListening,
    stopListeningAndGetTranscript,
    speak,
    stopSpeaking,
    toggleVoiceEnabled,
    resetTranscript
  } = useVoice();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showVoiceControls, setShowVoiceControls] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages]);
  
  // Stop listening and send message when user finishes speaking
  useEffect(() => {
    if (isListening && transcript && !transcript.endsWith('...') && transcript.length > 5) {
      const timer = setTimeout(() => {
        const finalTranscript = stopListeningAndGetTranscript();
        if (finalTranscript) {
          sendMessage(finalTranscript);
          resetTranscript();
        }
      }, 1500); // Wait 1.5s of silence before sending
      
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, stopListeningAndGetTranscript, sendMessage, resetTranscript]);
  
  // Show voice controls temporarily when voice features are used
  useEffect(() => {
    if (isListening || isSpeaking) {
      setShowVoiceControls(true);
      
      // Hide after a delay when neither listening nor speaking
      if (!isListening && !isSpeaking) {
        const timer = setTimeout(() => {
          setShowVoiceControls(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isListening, isSpeaking]);
  
  // Handle message sending
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  // No current session, show empty state
  if (!currentSession) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Welcome to Agent Elohim</h2>
          <p className="text-muted-foreground mb-6">Start a new conversation to begin</p>
          <button
            onClick={createNewSession}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Start Conversation
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex overflow-hidden">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSession.id}
        onNewSession={createNewSession}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
      
      <div className="flex-1 flex flex-col h-full">
        <Header
          title={currentSession.title}
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        
        <div className="flex-1 relative">
          <ScrollArea className="h-full pb-20">
            <div className="p-4">
              {currentSession.messages.map((message, index) => {
                const previousMessage = index > 0 ? currentSession.messages[index - 1] : null;
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    previousRole={previousMessage?.role}
                    speak={speak}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {showVoiceControls && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <VoiceControl
                isListening={isListening}
                isSpeaking={isSpeaking}
                voiceEnabled={voiceEnabled}
                toggleListening={toggleListening}
                toggleVoiceEnabled={toggleVoiceEnabled}
                stopSpeaking={stopSpeaking}
              />
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isListening={isListening}
            toggleListening={toggleListening}
            transcript={transcript}
            isSpeaking={isSpeaking}
            voiceEnabled={voiceEnabled}
            toggleVoiceEnabled={toggleVoiceEnabled}
            stopSpeaking={stopSpeaking}
            resetTranscript={resetTranscript}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
