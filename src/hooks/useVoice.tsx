
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import * as elevenLabsService from '@/services/elevenLabsService';

// Debug logging function that always logs regardless of environment
const debugLog = (...args: any[]) => {
  console.log('[Voice Debug]', ...args);
};

export interface VoiceInfo {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  isCustom?: boolean;
}

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [handsFreeMode, setHandsFreeMode] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<{timestamp: number, text: string}[]>([]);
  const [availableVoices, setAvailableVoices] = useState<VoiceInfo[]>([]);
  const [currentVoiceId, setCurrentVoiceId] = useState<string>('');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element for playback
  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Load API key and default voice ID from localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('elevenlabs-api-key') || '';
    const storedVoiceId = localStorage.getItem('elevenlabs-voice-id') || 'EXAVITQu4vr4xnSDxMaL'; // Default voice (Sarah)
    
    setElevenLabsApiKey(storedApiKey);
    setCurrentVoiceId(storedVoiceId);
    
    // Load voices if API key exists
    if (storedApiKey) {
      loadVoices();
    } else {
      // Use default voices when no API key is set
      setAvailableVoices(elevenLabsService.getDefaultVoices());
    }
  }, []);

  // Load available voices from ElevenLabs
  const loadVoices = useCallback(async () => {
    try {
      const voices = await elevenLabsService.getVoices();
      setAvailableVoices(voices);
      debugLog('Loaded voices:', voices.length);
    } catch (error) {
      console.error('Failed to load voices:', error);
      toast.error('Failed to load voices. Using default voice list.');
      setAvailableVoices(elevenLabsService.getDefaultVoices());
    }
  }, []);

  // Update ElevenLabs API key
  const updateApiKey = useCallback((apiKey: string) => {
    setElevenLabsApiKey(apiKey);
    elevenLabsService.setApiKey(apiKey);
    
    if (apiKey) {
      loadVoices();
    }
    
    toast.success('ElevenLabs API key updated');
  }, [loadVoices]);

  // Update the current voice
  const updateVoice = useCallback((voiceId: string) => {
    setCurrentVoiceId(voiceId);
    elevenLabsService.setDefaultVoiceId(voiceId);
    
    const selectedVoice = availableVoices.find(v => v.voice_id === voiceId);
    if (selectedVoice) {
      toast.success(`Voice set to ${selectedVoice.name}`);
    }
  }, [availableVoices]);

  // Clone a new voice
  const cloneVoice = useCallback(async (name: string, description: string, files: File[]) => {
    try {
      if (!elevenLabsApiKey) {
        toast.error('ElevenLabs API key is required');
        return null;
      }
      
      toast.loading('Cloning voice...');
      const result = await elevenLabsService.cloneVoice(name, description, files);
      
      if (result) {
        toast.success(`Voice "${name}" created successfully`);
        await loadVoices(); // Refresh the voice list
        return result;
      } else {
        toast.error('Failed to clone voice');
        return null;
      }
    } catch (error) {
      console.error('Error cloning voice:', error);
      toast.error('Error cloning voice');
      return null;
    }
  }, [elevenLabsApiKey, loadVoices]);

  // Delete a voice
  const deleteCustomVoice = useCallback(async (voiceId: string) => {
    try {
      const success = await elevenLabsService.deleteVoice(voiceId);
      
      if (success) {
        toast.success('Voice deleted successfully');
        await loadVoices(); // Refresh the voice list
        
        // If the deleted voice was the current one, switch to default
        if (currentVoiceId === voiceId) {
          const defaultVoice = 'EXAVITQu4vr4xnSDxMaL'; // Sarah
          setCurrentVoiceId(defaultVoice);
          elevenLabsService.setDefaultVoiceId(defaultVoice);
        }
        
        return true;
      } else {
        toast.error('Failed to delete voice');
        return false;
      }
    } catch (error) {
      console.error('Error deleting voice:', error);
      toast.error('Error deleting voice');
      return false;
    }
  }, [currentVoiceId, loadVoices]);

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

  // Speak text using ElevenLabs TTS
  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      debugLog('Speaking with ElevenLabs:', text.substring(0, 50) + '...');
      
      // If we don't have an API key, use the native Speech Synthesis
      if (!elevenLabsApiKey) {
        if ('speechSynthesis' in window) {
          const synthesis = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(text);
          
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
          setIsSpeaking(false);
        }
        return;
      }
      
      // Use ElevenLabs TTS
      const audioData = await elevenLabsService.textToSpeech(text, currentVoiceId);
      
      if (!audioData) {
        throw new Error('Failed to get audio data');
      }
      
      // Create audio blob and play it
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          debugLog('ElevenLabs audio playback ended');
        };
        
        audioRef.current.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error during text-to-speech:', error);
      setIsSpeaking(false);
      
      // Fallback to browser speech synthesis
      if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        synthesis.speak(utterance);
        toast.error('Using browser speech instead: ElevenLabs error');
      }
    }
  }, [voiceEnabled, elevenLabsApiKey, currentVoiceId]);

  // Stop any ongoing speech
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    debugLog('Speech stopped');
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
    availableVoices,
    currentVoiceId,
    elevenLabsApiKey,
    toggleListening,
    toggleVoiceEnabled,
    toggleHandsFreeMode,
    speak,
    stopSpeaking,
    resetTranscript,
    updateApiKey,
    updateVoice,
    cloneVoice,
    deleteCustomVoice,
    loadVoices
  };
};

export default useVoice;
