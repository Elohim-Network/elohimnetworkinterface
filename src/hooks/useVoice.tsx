import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import * as elevenLabsService from '@/services/elevenLabsService';
import * as browserVoiceService from '@/services/browserVoiceService';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types/speech-recognition.d.ts';

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
  const [useBrowserVoice, setUseBrowserVoice] = useState(false);
  const [browserVoices, setBrowserVoices] = useState<any[]>([]);
  const [currentBrowserVoiceId, setCurrentBrowserVoiceId] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('elevenlabs-api-key') || '';
    const storedVoiceId = localStorage.getItem('elevenlabs-voice-id') || 'EXAVITQu4vr4xnSDxMaL';
    
    setElevenLabsApiKey(storedApiKey);
    setCurrentVoiceId(storedVoiceId);
    
    if (storedApiKey) {
      loadVoices();
    } else {
      setAvailableVoices(elevenLabsService.getDefaultVoices());
    }
  }, []);

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

  const updateApiKey = useCallback((apiKey: string) => {
    setElevenLabsApiKey(apiKey);
    elevenLabsService.setApiKey(apiKey);
    
    if (apiKey) {
      loadVoices();
    }
    
    toast.success('ElevenLabs API key updated');
  }, [loadVoices]);

  const updateVoice = useCallback((voiceId: string) => {
    setCurrentVoiceId(voiceId);
    elevenLabsService.setDefaultVoiceId(voiceId);
    
    const selectedVoice = availableVoices.find(v => v.voice_id === voiceId);
    if (selectedVoice) {
      toast.success(`Voice set to ${selectedVoice.name}`);
    }
  }, [availableVoices]);

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
        await loadVoices();
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

  const deleteCustomVoice = useCallback(async (voiceId: string) => {
    try {
      const success = await elevenLabsService.deleteVoice(voiceId);
      
      if (success) {
        toast.success('Voice deleted successfully');
        await loadVoices();
        
        if (currentVoiceId === voiceId) {
          const defaultVoice = 'EXAVITQu4vr4xnSDxMaL';
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

  useEffect(() => {
    const storedBrowserVoices = browserVoiceService.getStoredVoices();
    setBrowserVoices(storedBrowserVoices);
    
    const currentBrowserVoice = browserVoiceService.getCurrentVoiceId();
    setCurrentBrowserVoiceId(currentBrowserVoice);
    
    const useBrowserVoiceSetting = localStorage.getItem('use-browser-voice') === 'true';
    setUseBrowserVoice(useBrowserVoiceSetting);
  }, []);

  const toggleBrowserVoice = useCallback((use: boolean) => {
    setUseBrowserVoice(use);
    localStorage.setItem('use-browser-voice', String(use));
    toast.success(use ? 'Using your own voice recordings' : 'Using ElevenLabs voices');
  }, []);

  const updateBrowserVoice = useCallback((voiceId: string) => {
    setCurrentBrowserVoiceId(voiceId);
    browserVoiceService.setCurrentVoiceId(voiceId);
    
    const selectedVoice = browserVoices.find(v => v.id === voiceId);
    if (selectedVoice) {
      toast.success(`Voice set to ${selectedVoice.name}`);
    }
  }, [browserVoices]);

  const refreshBrowserVoices = useCallback(() => {
    const voices = browserVoiceService.getStoredVoices();
    setBrowserVoices(voices);
  }, []);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      
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

  useEffect(() => {
    if (!recognition) return;
    
    const handleResult = (event: SpeechRecognitionEvent) => {
      try {
        debugLog('Speech recognition result event:', event);
        
        let finalTranscript = '';
        let interimTranscript = '';
        let isFinal = false;
        
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            isFinal = true;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          debugLog('Final transcript:', finalTranscript);
          setTranscript(finalTranscript);
          
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

  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
    debugLog('Toggling listening state to:', !isListening);
    
    if (isListening) {
      setTranscript('');
    } else {
      toast.info('Listening for voice input...');
    }
  }, [isListening]);

  const toggleVoiceEnabled = useCallback(() => {
    setVoiceEnabled(prev => !prev);
    debugLog('Toggling voice enabled state to:', !voiceEnabled);
    
    toast.info(voiceEnabled ? 'Voice output disabled' : 'Voice output enabled');
  }, [voiceEnabled]);

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

  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      debugLog('Speaking:', text.substring(0, 50) + '...');
      
      if (useBrowserVoice && currentBrowserVoiceId) {
        debugLog('Using browser voice:', currentBrowserVoiceId);
        
        try {
          await browserVoiceService.speakWithRecordedVoice(text, currentBrowserVoiceId);
          setIsSpeaking(false);
          return;
        } catch (error) {
          console.error('Error using browser voice:', error);
        }
      }
      
      if (!elevenLabsApiKey || useBrowserVoice) {
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
      
      const audioData = await elevenLabsService.textToSpeech(text, currentVoiceId);
      
      if (!audioData) {
        throw new Error('Failed to get audio data');
      }
      
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
      
      if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        synthesis.speak(utterance);
        toast.error('Using browser speech instead: Error encountered');
      }
    }
  }, [voiceEnabled, elevenLabsApiKey, currentVoiceId, useBrowserVoice, currentBrowserVoiceId]);

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
    loadVoices,
    useBrowserVoice,
    browserVoices,
    currentBrowserVoiceId,
    toggleBrowserVoice,
    updateBrowserVoice,
    refreshBrowserVoices
  };
};

export default useVoice;
