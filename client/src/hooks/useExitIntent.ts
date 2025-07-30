import { useState, useEffect, useCallback } from 'react';

interface ExitIntentOptions {
  threshold: number;
  triggerOnIdle: boolean;
  idleTime: number;
  cookieDuration: number;
}

export const useExitIntent = (options: ExitIntentOptions) => {
  const [showExitIntent, setShowExitIntent] = useState(false);

  const closeExitIntent = useCallback(() => {
    setShowExitIntent(false);
    localStorage.setItem('exit-intent-shown', Date.now().toString());
  }, []);

  useEffect(() => {
    const lastShown = localStorage.getItem('exit-intent-shown');
    const now = Date.now();
    
    // Don't show if shown recently
    if (lastShown && (now - parseInt(lastShown)) < (options.cookieDuration * 24 * 60 * 60 * 1000)) {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= options.threshold) {
        setShowExitIntent(true);
      }
    };

    let idleTimer: NodeJS.Timeout;
    
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (options.triggerOnIdle) {
        idleTimer = setTimeout(() => {
          setShowExitIntent(true);
        }, options.idleTime);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    
    resetIdleTimer();

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', resetIdleTimer);
      document.removeEventListener('keypress', resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, [options]);

  return {
    showExitIntent,
    closeExitIntent
  };
};