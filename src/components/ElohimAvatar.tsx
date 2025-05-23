
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ElohimAvatarProps {
  isVisible: boolean;
  onIntroductionComplete?: () => void;
}

const ElohimAvatar: React.FC<ElohimAvatarProps> = ({ 
  isVisible, 
  onIntroductionComplete 
}) => {
  const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting' | 'hidden'>(
    isVisible ? 'entering' : 'hidden'
  );

  useEffect(() => {
    if (isVisible && animationState === 'hidden') {
      setAnimationState('entering');
    } else if (!isVisible && (animationState === 'visible' || animationState === 'entering')) {
      setAnimationState('exiting');
    }
  }, [isVisible, animationState]);

  useEffect(() => {
    let timer: number;
    
    if (animationState === 'entering') {
      timer = window.setTimeout(() => {
        setAnimationState('visible');
      }, 1000); // Animation duration
    } else if (animationState === 'exiting') {
      timer = window.setTimeout(() => {
        setAnimationState('hidden');
      }, 1000); // Animation duration
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [animationState]);

  if (animationState === 'hidden') {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed z-50 transition-all duration-1000 ease-in-out",
        animationState === 'entering' ? "right-[-10rem] opacity-0" : "",
        animationState === 'visible' ? "right-4 opacity-100" : "",
        animationState === 'exiting' ? "right-[-15rem] opacity-0" : "",
        "bottom-20 md:bottom-24 flex flex-col items-center"
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 blur-md opacity-70"></div>
        <Avatar className="h-32 w-32 border-4 border-primary shadow-lg relative z-10">
          <AvatarImage src="/agent-elohim.png" alt="Agent Elohim" className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white text-2xl">AE</AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-2 w-48 h-2 bg-primary rounded-full animate-pulse"></div>
      <div className="bg-white dark:bg-gray-800 p-3 mt-2 rounded-lg shadow-lg max-w-[250px] text-center text-sm">
        <p>Hi, I'm Agent Elohim. Need assistance?</p>
      </div>
    </div>
  );
};

export default ElohimAvatar;
