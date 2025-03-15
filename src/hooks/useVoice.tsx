
import { useState, useCallback, useEffect, useRef } from 'react';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synth = useRef(window.speechSynthesis);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.error('Could not restart recognition:', e);
            setIsListening(false);
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
  }, [isListening]);
  
  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (!isListening) {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    } else {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  }, [isListening]);
  
  // Stop listening and return the final transcript
  const stopListeningAndGetTranscript = useCallback(() => {
    if (!recognitionRef.current || !isListening) return transcript;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping recognition:', e);
    }
    
    return transcript;
  }, [isListening, transcript]);
  
  // Speak text using speech synthesis
  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    if (synth.current.speaking) {
      synth.current.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices and select one
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
  
  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synth.current.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  // Toggle voice enablement
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
    toggleListening,
    stopListeningAndGetTranscript,
    speak,
    stopSpeaking,
    toggleVoiceEnabled,
    resetTranscript: () => setTranscript('')
  };
}
