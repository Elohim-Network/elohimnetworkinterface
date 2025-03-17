
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useChat } from '@/hooks/useChat';
import { useVoice } from '@/hooks/useVoice';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import VoiceControl from '@/components/VoiceControl';
import { toast } from 'sonner';
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
    handsFreeMode,
    voiceHistory,
    availableVoices,
    currentVoiceId,
    elevenLabsApiKey,
    toggleListening,
    toggleVoiceEnabled,
    toggleHandsFreeMode,
    speak,
    stopSpeaking,
    resetTranscript,
    updateApiKey,
    updateVoice,
    cloneVoice,
    deleteCustomVoice,
    loadVoices
  } = useVoice();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showVoiceControls, setShowVoiceControls] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleUpdateConnectionConfig = useCallback((config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
    mistralModel: string;
    sdModel: string;
  }) => {
    toast.success('Connection settings updated. Your next message will use the new endpoints.');
  }, []);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages]);
  
  useEffect(() => {
    if (isListening && transcript && !transcript.endsWith('...') && transcript.length > 5) {
      const timer = setTimeout(() => {
        toggleListening();
        if (transcript) {
          sendMessage(transcript);
          resetTranscript();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, toggleListening, sendMessage, resetTranscript]);
  
  useEffect(() => {
    if (handsFreeMode && transcript && !transcript.endsWith('...') && transcript.length > 10) {
      const timer = setTimeout(() => {
        if (transcript) {
          sendMessage(transcript);
          resetTranscript();
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [handsFreeMode, transcript, sendMessage, resetTranscript]);
  
  useEffect(() => {
    if (isListening || isSpeaking || handsFreeMode) {
      setShowVoiceControls(true);
      
      if (!isListening && !isSpeaking && !handsFreeMode) {
        const timer = setTimeout(() => {
          setShowVoiceControls(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isListening, isSpeaking, handsFreeMode]);
  
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
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
        currentSessionId={currentSession?.id}
        onNewSession={createNewSession}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        conversationHistory={voiceHistory}
      />
      
      <div className="flex-1 flex flex-col h-full">
        <Header
          title={currentSession.title}
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onUpdateConnectionConfig={handleUpdateConnectionConfig}
          sessions={sessions}
          onExportChats={sessions.length > 0 ? () => toast.info('Exporting conversations...') : undefined}
          onImportChats={(sessions, merge) => toast.success(`Conversations ${merge ? 'merged' : 'imported'} successfully`)}
          // Voice related props
          availableVoices={availableVoices}
          currentVoiceId={currentVoiceId}
          elevenLabsApiKey={elevenLabsApiKey}
          onUpdateVoiceApiKey={updateApiKey}
          onUpdateVoice={updateVoice}
          onCloneVoice={cloneVoice}
          onDeleteVoice={deleteCustomVoice}
          onRefreshVoices={loadVoices}
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
          
          {(showVoiceControls || handsFreeMode) && (
            <div className="absolute top-4 right-4 z-10">
              <VoiceControl
                isListening={isListening}
                isSpeaking={isSpeaking}
                voiceEnabled={voiceEnabled}
                handsFreeMode={handsFreeMode}
                toggleListening={toggleListening}
                toggleVoiceEnabled={toggleVoiceEnabled}
                toggleHandsFreeMode={toggleHandsFreeMode}
                stopSpeaking={stopSpeaking}
              />
            </div>
          )}
          
          {handsFreeMode && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 glass p-2 rounded-lg animate-pulse-subtle">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Hands-free mode active</span>
              </div>
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
            handsFreeMode={handsFreeMode}
            toggleHandsFreeMode={toggleHandsFreeMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
