
import { useState, useEffect } from 'react';

interface UseExitIntentOptions {
  threshold?: number;
  eventThrottle?: number;
  triggerOnIdle?: boolean;
  idleTime?: number;
  disableOnMobile?: boolean;
  onExitIntent?: () => void;
}

export const useExitIntent = ({
  threshold = 30,
  eventThrottle = 200,
  triggerOnIdle = false,
  idleTime = 10000,
  disableOnMobile = true,
  onExitIntent
}: UseExitIntentOptions = {}) => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [idleTimer, setIdleTimer] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isMobile, setIsMobile] = useState(false);

  // Check if the user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    
    // Handle window resize for potential device rotation
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mouse movement to detect exit intent
  useEffect(() => {
    if (disableOnMobile && isMobile) return;

    let throttleTimer: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimer !== null) return;
      
      throttleTimer = window.setTimeout(() => {
        throttleTimer = null;
        
        setLastActivity(Date.now());
        
        // If mouse is near the top of the page and moving upward, trigger exit intent
        if (e.clientY < threshold && e.movementY < 0) {
          if (!showExitIntent) {
            setShowExitIntent(true);
            if (onExitIntent) onExitIntent();
          }
        }
      }, eventThrottle);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimer !== null) {
        clearTimeout(throttleTimer);
      }
    };
  }, [threshold, eventThrottle, showExitIntent, disableOnMobile, isMobile, onExitIntent]);

  // Handle idle time trigger
  useEffect(() => {
    if (!triggerOnIdle) return;
    
    const handleActivity = () => {
      setLastActivity(Date.now());
      
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
        setIdleTimer(null);
      }
      
      const timer = window.setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        if (timeSinceLastActivity >= idleTime && !showExitIntent) {
          setShowExitIntent(true);
          if (onExitIntent) onExitIntent();
        }
      }, idleTime);
      
      setIdleTimer(timer);
    };
    
    // Set up event listeners for user activity
    ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(eventName => {
      document.addEventListener(eventName, handleActivity);
    });
    
    // Start idle timer
    handleActivity();
    
    return () => {
      ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(eventName => {
        document.removeEventListener(eventName, handleActivity);
      });
      
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
      }
    };
  }, [idleTime, lastActivity, showExitIntent, triggerOnIdle, idleTimer, onExitIntent]);

  const closeExitIntent = () => {
    setShowExitIntent(false);
  };

  return {
    showExitIntent,
    closeExitIntent
  };
};

export default useExitIntent;
