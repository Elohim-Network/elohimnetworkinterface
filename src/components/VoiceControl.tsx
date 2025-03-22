
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, VolumeX, Headphones, Glasses, UserCircle2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoiceControlProps {
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  handsFreeMode: boolean;
  toggleListening: () => void;
  toggleVoiceEnabled: () => void;
  toggleHandsFreeMode: () => void;
  stopSpeaking: () => void;
  showAvatar?: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  isSpeaking,
  voiceEnabled,
  handsFreeMode,
  toggleListening,
  toggleVoiceEnabled,
  toggleHandsFreeMode,
  stopSpeaking,
  showAvatar
}) => {
  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.error('Microphone permission denied:', err);
      toast.error('Microphone access denied. Please enable microphone access in your browser settings.');
      return false;
    }
  };

  const handleMicClick = async () => {
    const hasPermission = await checkMicPermission();
    if (hasPermission) {
      toggleListening();
    }
  };

  return (
    <div className="glass p-1 rounded-full flex items-center gap-1 animate-scale-in shadow-md absolute top-3 right-3 z-10">
      <Button
        variant={isListening ? "destructive" : "ghost"}
        size="icon"
        className={cn(
          "rounded-full h-7 w-7",
          isListening && "animate-pulse-subtle"
        )}
        onClick={handleMicClick}
        title={isListening ? "Stop listening" : "Voice input"}
      >
        <Mic className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant={handsFreeMode ? "destructive" : "ghost"}
        size="icon"
        className={cn(
          "rounded-full h-7 w-7",
          handsFreeMode && "animate-pulse-subtle"
        )}
        onClick={toggleHandsFreeMode}
        title={handsFreeMode ? "Switch to text input" : "Enable hands-free voice mode"}
      >
        {handsFreeMode ? (
          <MessageSquare className="h-3.5 w-3.5" />
        ) : (
          <Glasses className="h-3.5 w-3.5" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full h-7 w-7",
          isSpeaking && "animate-pulse-subtle",
          !voiceEnabled && "opacity-60"
        )}
        onClick={() => {
          if (isSpeaking) {
            stopSpeaking();
          } else {
            toggleVoiceEnabled();
          }
        }}
        title={isSpeaking ? "Stop speaking" : (voiceEnabled ? "Voice output on" : "Voice output off")}
      >
        {isSpeaking ? (
          <VolumeX className="h-3.5 w-3.5 text-destructive" />
        ) : (
          <Volume2 className="h-3.5 w-3.5" />
        )}
      </Button>

      {showAvatar && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-7 w-7"
          onClick={showAvatar}
          title="Show Agent Elohim"
        >
          <UserCircle2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default VoiceControl;
