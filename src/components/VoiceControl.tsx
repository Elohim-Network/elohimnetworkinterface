
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, VolumeX, Headphones, HandsClapping } from 'lucide-react';
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
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  isSpeaking,
  voiceEnabled,
  handsFreeMode,
  toggleListening,
  toggleVoiceEnabled,
  toggleHandsFreeMode,
  stopSpeaking
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
    <div className="glass p-1.5 rounded-full flex items-center gap-1.5 animate-scale-in shadow-md">
      <Button
        variant={isListening ? "destructive" : "ghost"}
        size="icon"
        className={cn(
          "rounded-full h-8 w-8",
          isListening && "animate-pulse-subtle"
        )}
        onClick={handleMicClick}
        title={isListening ? "Stop listening" : "Voice input"}
      >
        <Mic className="h-4 w-4" />
      </Button>
      
      <Button
        variant={handsFreeMode ? "destructive" : "ghost"}
        size="icon"
        className="rounded-full h-8 w-8"
        onClick={toggleHandsFreeMode}
        title={handsFreeMode ? "Disable hands-free mode" : "Enable hands-free mode"}
      >
        <HandsClapping className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full h-8 w-8",
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
          <VolumeX className="h-4 w-4 text-destructive" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default VoiceControl;
