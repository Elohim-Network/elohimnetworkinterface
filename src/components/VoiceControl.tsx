
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceControlProps {
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  toggleListening: () => void;
  toggleVoiceEnabled: () => void;
  stopSpeaking: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  isSpeaking,
  voiceEnabled,
  toggleListening,
  toggleVoiceEnabled,
  stopSpeaking
}) => {
  return (
    <div className="glass p-2 rounded-full flex items-center gap-2 animate-scale-in">
      <Button
        variant={isListening ? "destructive" : "secondary"}
        size="sm"
        className={cn(
          "rounded-full flex items-center gap-1.5 px-3 animate-press",
          isListening && "animate-pulse-subtle"
        )}
        onClick={toggleListening}
      >
        <Mic className="h-4 w-4" />
        <span>{isListening ? "Listening..." : "Voice Input"}</span>
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        className={cn(
          "rounded-full flex items-center gap-1.5 px-3 animate-press",
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
      >
        {isSpeaking ? (
          <>
            <VolumeX className="h-4 w-4 text-destructive" />
            <span className="text-destructive">Stop</span>
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            <span>{voiceEnabled ? "Voice On" : "Voice Off"}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default VoiceControl;
