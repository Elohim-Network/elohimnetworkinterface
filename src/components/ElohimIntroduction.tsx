
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Volume2, X } from 'lucide-react';
import { toast } from 'sonner';
import ElohimAvatar from './ElohimAvatar';

interface ElohimIntroductionProps {
  onComplete: () => void;
  onSkip: () => void;
}

const ElohimIntroduction: React.FC<ElohimIntroductionProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(0);
  const [showAvatar, setShowAvatar] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const introSteps = [
    "Hello! I'm Agent Elohim, your personal assistant powered by advanced AI technology.",
    "You can talk to me using just your voice. Ask me any questions, and I'll guide you through the Elohim Network platform.",
    "I can recommend products, explain features, and help you find exactly what you're looking for.",
    "The best part? I'm using powerful open-source tools right now, but when you decide to upgrade, I'll gain even more capabilities.",
  ];

  useEffect(() => {
    if (step < introSteps.length) {
      startSpeaking(introSteps[step]);
    } else {
      onComplete();
    }
  }, [step]);

  const startSpeaking = (text: string) => {
    setIsPlaying(true);
    
    // Simulate speech with a delay - in production this would use the speech API
    const wordCount = text.split(' ').length;
    const speakingTime = wordCount * 400; // Average speaking time per word
    
    setTimeout(() => {
      setIsPlaying(false);
      if (step < introSteps.length - 1) {
        // Auto advance to next step after a short pause
        setTimeout(() => setStep(step + 1), 1000);
      } else {
        // Final step - wait a moment before completion
        setTimeout(() => onComplete(), 1500);
      }
    }, speakingTime);
  };

  const handleSkip = () => {
    setShowAvatar(false);
    setTimeout(() => onSkip(), 1000);
  };

  const handleMicClick = () => {
    toast.info("Voice input is available after the introduction!");
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <ElohimAvatar isVisible={showAvatar} />
      
      <Card className="relative max-w-md w-full p-6 m-4 shadow-xl">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2" 
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-1">Meet Agent Elohim</h2>
          <p className="text-center text-muted-foreground">Your AI Assistant</p>
        </div>
        
        <div className="min-h-[100px] mb-4 p-4 border rounded-lg bg-muted/50">
          <p className={`transition-opacity ${isPlaying ? 'animate-pulse' : ''}`}>
            {introSteps[step]}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full" 
              onClick={handleMicClick}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant={isPlaying ? "default" : "secondary"} 
              className="rounded-full" 
              disabled
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-1">
            {introSteps.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 w-2 rounded-full ${step === i ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              ></div>
            ))}
          </div>
          
          <Button onClick={() => setStep(prevStep => 
            prevStep < introSteps.length - 1 ? prevStep + 1 : prevStep
          )}>
            {step < introSteps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ElohimIntroduction;
