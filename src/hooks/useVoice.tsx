import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
  error?: any;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang?: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [handsFreeMode, setHandsFreeMode] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{text: string, timestamp: number}[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synth = useRef(window.speechSynthesis);
  
  useEffect(() => {
    console.log('SpeechRecognition support:', 'SpeechRecognition' in window);
    console.log('webkitSpeechRecognition support:', 'webkitSpeechRecognition' in window);
    
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.');
    }
  }, []);
  
  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        console.log('Speech recognition result:', transcriptText);
        setTranscript(transcriptText);
        
        if (handsFreeMode && event.results[current].isFinal) {
          setConversationHistory(prev => [...prev, {
            text: transcriptText,
            timestamp: Date.now()
          }]);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Speech recognition error: ${event.error}. Try refreshing the page.`);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended, isListening:', isListening);
        if (isListening || handsFreeMode) {
          try {
            console.log('Attempting to restart recognition');
            recognitionRef.current?.start();
          } catch (e) {
            console.error('Could not restart recognition:', e);
            setIsListening(false);
            if (handsFreeMode) {
              setHandsFreeMode(false);
              toast.error('Hands-free mode stopped due to an error. Please try again.');
            }
          }
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        
        if (isListening) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.error('Error stopping recognition:', e);
          }
        }
      }
    };
  }, [isListening, handsFreeMode]);
  
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }
    
    if (!isListening) {
      setTranscript('');
      try {
        console.log('Starting speech recognition');
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Voice input activated');
      } catch (e) {
        console.error('Error starting recognition:', e);
        toast.error('Failed to start voice input. Try refreshing the page.');
      }
    } else {
      try {
        console.log('Stopping speech recognition');
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  }, [isListening]);
  
  const toggleHandsFreeMode = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }
    
    setHandsFreeMode(prev => {
      const newValue = !prev;
      
      if (newValue) {
        try {
          recognitionRef.current?.start();
          toast.success('Hands-free mode activated. All speech will be recorded.');
        } catch (e) {
          console.error('Error starting hands-free mode:', e);
          toast.error('Failed to start hands-free mode');
          return false;
        }
      } else {
        try {
          if (!isListening) {
            recognitionRef.current?.stop();
          }
          toast.success('Hands-free mode deactivated');
        } catch (e) {
          console.error('Error stopping hands-free mode:', e);
        }
      }
      
      return newValue;
    });
  }, [isListening]);
  
  const stopListeningAndGetTranscript = useCallback(() => {
    if (!recognitionRef.current || (!isListening && !handsFreeMode)) return transcript;
    
    try {
      if (!handsFreeMode) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    } catch (e) {
      console.error('Error stopping recognition:', e);
    }
    
    return transcript;
  }, [isListening, transcript, handsFreeMode]);
  
  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    if (synth.current.speaking) {
      synth.current.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synth.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Daniel') || // More natural male voice
      voice.name.includes('Google US English') || 
      voice.name.includes('en-US')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    synth.current.speak(utterance);
  }, [voiceEnabled]);
  
  const stopSpeaking = useCallback(() => {
    if (synth.current.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  const toggleVoiceEnabled = useCallback(() => {
    setVoiceEnabled(prev => !prev);
    if (synth.current.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  return {
    isListening,
    transcript,
    isSpeaking,
    voiceEnabled,
    handsFreeMode,
    conversationHistory,
    toggleListening,
    toggleHandsFreeMode,
    stopListeningAndGetTranscript,
    speak,
    stopSpeaking,
    toggleVoiceEnabled,
    resetTranscript: () => setTranscript('')
  };
}
