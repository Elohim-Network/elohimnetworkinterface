
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Debug logging function that always logs regardless of environment
const debugLog = (...args: any[]) => {
  console.log('[Voice Debug]', ...args);
};

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [handsFreeMode, setHandsFreeMode] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<{timestamp: number, text: string}[]>([]);

  // Initialize speech recognition on component mount
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      setRecognition(recognitionInstance);
      debugLog('Speech recognition initialized');
    } else {
      toast.error('Speech recognition is not supported in this browser');
      debugLog('Speech recognition not supported');
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
          debugLog('Speech recognition stopped on unmount');
        } catch (e) {
          debugLog('Error stopping recognition on unmount:', e);
        }
      }
    };
  }, []);

  // Set up event listeners for speech recognition
  useEffect(() => {
    if (!recognition) return;
    
    const handleResult = (event: SpeechRecognitionEvent) => {
      try {
        debugLog('Speech recognition result event:', event);
        
        let finalTranscript = '';
        let interimTranscript = '';
        let isFinal = false;
        
        // Loop through the results to build final and interim transcripts
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            isFinal = true;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        // If we have a final transcript, update the state and handle hands-free mode
        if (finalTranscript) {
          debugLog('Final transcript:', finalTranscript);
          setTranscript(finalTranscript);
          
          // Save to voice history if hands-free mode is enabled
          if (handsFreeMode) {
            setVoiceHistory(prev => [...prev, {
              timestamp: Date.now(),
              text: finalTranscript
            }]);
          }
        } else if (interimTranscript) {
          debugLog('Interim transcript:', interimTranscript);
          setTranscript(interimTranscript);
        }
      } catch (e) {
        debugLog('Error processing speech result:', e);
      }
    };
    
    const handleError = (event: SpeechRecognitionErrorEvent) => {
      debugLog('Speech recognition error:', event.error);
      toast.error(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    const handleEnd = () => {
      debugLog('Speech recognition ended');
      if (isListening) {
        try {
          recognition.start();
          debugLog('Restarting speech recognition');
        } catch (e) {
          debugLog('Error restarting recognition:', e);
          setIsListening(false);
        }
      }
    };
    
    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;
    
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [recognition, isListening, handsFreeMode]);

  // Start or stop listening based on isListening state
  useEffect(() => {
    if (!recognition) return;
    
    if (isListening) {
      try {
        recognition.start();
        debugLog('Speech recognition started');
      } catch (error) {
        debugLog('Error starting speech recognition:', error);
        toast.error('Error starting speech recognition. Please try again.');
        setIsListening(false);
      }
    } else {
      try {
        recognition.stop();
        debugLog('Speech recognition stopped');
      } catch (error) {
        debugLog('Error stopping speech recognition:', error);
      }
    }
  }, [isListening, recognition]);

  // Toggle voice recognition on/off
  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
    debugLog('Toggling listening state to:', !isListening);
    
    if (isListening) {
      setTranscript('');
    } else {
      toast.info('Listening for voice input...');
    }
  }, [isListening]);

  // Toggle voice output on/off
  const toggleVoiceEnabled = useCallback(() => {
    setVoiceEnabled(prev => !prev);
    debugLog('Toggling voice enabled state to:', !voiceEnabled);
    
    toast.info(voiceEnabled ? 'Voice output disabled' : 'Voice output enabled');
  }, [voiceEnabled]);

  // Toggle hands-free mode on/off
  const toggleHandsFreeMode = useCallback(() => {
    setHandsFreeMode(prev => !prev);
    debugLog('Toggling hands-free mode to:', !handsFreeMode);
    
    toast.info(handsFreeMode 
      ? 'Hands-free mode disabled' 
      : 'Hands-free mode enabled - all voice will be recorded');
      
    if (!handsFreeMode && !isListening) {
      setIsListening(true);
    }
  }, [handsFreeMode, isListening]);

  // Speak text using speech synthesis
  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        debugLog('Speech synthesis started');
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        debugLog('Speech synthesis ended');
      };
      
      utterance.onerror = (event) => {
        debugLog('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      synthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis is not supported in this browser');
      debugLog('Speech synthesis not supported');
    }
  }, [voiceEnabled]);

  // Stop any ongoing speech
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      debugLog('Speech synthesis stopped');
    }
  }, []);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    debugLog('Transcript reset');
  }, []);

  return {
    isListening,
    transcript,
    isSpeaking,
    voiceEnabled,
    handsFreeMode,
    voiceHistory,
    toggleListening,
    toggleVoiceEnabled,
    toggleHandsFreeMode,
    speak,
    stopSpeaking,
    resetTranscript
  };
};

export default useVoice;
