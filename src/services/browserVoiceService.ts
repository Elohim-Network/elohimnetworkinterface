
/**
 * Service for recording, storing and using custom browser-based voices
 */

// Type definitions
interface RecordedVoice {
  id: string;
  name: string;
  timestamp: number;
  audioUrl: string;
  samples: string[]; // URLs to audio samples
}

// Store for recorded voices
const STORAGE_KEY = 'custom-voice-samples';

// Get stored voices
export const getStoredVoices = (): RecordedVoice[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving stored voices:', error);
    return [];
  }
};

// Save a voice to local storage
export const saveVoice = (voice: RecordedVoice): void => {
  try {
    const voices = getStoredVoices();
    const existingIndex = voices.findIndex(v => v.id === voice.id);
    
    if (existingIndex >= 0) {
      voices[existingIndex] = voice;
    } else {
      voices.push(voice);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(voices));
  } catch (error) {
    console.error('Error saving voice:', error);
  }
};

// Delete a voice from storage
export const deleteVoice = (voiceId: string): boolean => {
  try {
    const voices = getStoredVoices();
    const filteredVoices = voices.filter(v => v.id !== voiceId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredVoices));
    return true;
  } catch (error) {
    console.error('Error deleting voice:', error);
    return false;
  }
};

// Generate unique ID for a voice
export const generateVoiceId = (): string => {
  return 'voice_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};

// Record audio using the browser's MediaRecorder API
export const recordAudio = async (): Promise<MediaRecorder> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    return mediaRecorder;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    throw new Error('Could not access microphone');
  }
};

// Convert a Blob to a data URL
export const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Get the current voice ID
export const getCurrentVoiceId = (): string => {
  return localStorage.getItem('current-browser-voice-id') || '';
};

// Set the current voice ID
export const setCurrentVoiceId = (voiceId: string): void => {
  localStorage.setItem('current-browser-voice-id', voiceId);
};

// Additional browser voice service functions
export const getVoices = (): SpeechSynthesisVoice[] => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
};

export const getCurrentVoice = (): SpeechSynthesisVoice | null => {
  const voices = getVoices();
  const storedVoiceName = localStorage.getItem('browser-voice-name');
  
  if (storedVoiceName) {
    return voices.find(v => v.name === storedVoiceName) || null;
  }
  
  return voices[0] || null;
};

export const setCurrentVoice = (voice: SpeechSynthesisVoice): void => {
  localStorage.setItem('browser-voice-name', voice.name);
};

export const getRate = (): number => {
  const rate = localStorage.getItem('browser-voice-rate');
  return rate ? parseFloat(rate) : 1.0;
};

export const setRate = (rate: number): void => {
  localStorage.setItem('browser-voice-rate', rate.toString());
};

export const getPitch = (): number => {
  const pitch = localStorage.getItem('browser-voice-pitch');
  return pitch ? parseFloat(pitch) : 1.0;
};

export const setPitch = (pitch: number): void => {
  localStorage.setItem('browser-voice-pitch', pitch.toString());
};

export const speak = (text: string): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getCurrentVoice();
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = getRate();
    utterance.pitch = getPitch();
    
    window.speechSynthesis.speak(utterance);
  }
};
