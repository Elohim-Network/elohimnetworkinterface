
import { useState, useEffect } from 'react';

interface UseExitIntentOptions {
  threshold?: number;
  eventThrottle?: number;
  triggerOnIdle?: boolean;
  idleTime?: number;
  disableOnMobile?: boolean;
  onExitIntent?: () => void;
  cookieDuration?: number; // Days to remember user's choice
}

export const useExitIntent = ({
  threshold = 30,
  eventThrottle = 200,
  triggerOnIdle = false,
  idleTime = 10000,
  disableOnMobile = true,
  onExitIntent,
  cookieDuration = 7 // Default: remember for 7 days
}: UseExitIntentOptions = {}) => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [idleTimer, setIdleTimer] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if popup was already shown and dismissed
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('exit-intent-seen');
    if (hasSeenPopup) {
      // If the user has seen the popup, don't show it again during this session
      setShowExitIntent(false);
    }
  }, []);

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
    if (localStorage.getItem('exit-intent-seen')) return; // Don't track if already seen

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
    if (localStorage.getItem('exit-intent-seen')) return; // Don't track if already seen
    
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
    // Remember that user has seen the popup
    localStorage.setItem('exit-intent-seen', Date.now().toString());
  };

  return {
    showExitIntent,
    closeExitIntent
  };
};

export default useExitIntent;
