
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

// Speak text using a recorded voice sample (pitch-shifted based on text)
export const speakWithRecordedVoice = async (text: string, voiceId: string): Promise<void> => {
  try {
    // Get the voice data
    const voices = getStoredVoices();
    const voice = voices.find(v => v.id === voiceId);
    
    if (!voice || !voice.samples.length) {
      throw new Error('Voice sample not found');
    }

    // Use the Web Speech API with voice modification attempts
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // We'll first try to use the sample directly by playing it
      // This is primitive and only demonstrates the concept
      // A more advanced implementation would analyze and synthesize proper speech
      playVoiceSample(voice.samples[0]);
      
      return;
    } else {
      throw new Error('Speech synthesis not supported in this browser');
    }
  } catch (error) {
    console.error('Error using recorded voice:', error);
    // Fall back to default browser voice
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

// Simple function to play an audio sample
const playVoiceSample = (audioUrl: string): void => {
  const audio = new Audio(audioUrl);
  audio.play().catch(err => console.error('Error playing audio:', err));
};

// Get the current voice ID
export const getCurrentVoiceId = (): string => {
  return localStorage.getItem('current-browser-voice-id') || '';
};

// Set the current voice ID
export const setCurrentVoiceId = (voiceId: string): void => {
  localStorage.setItem('current-browser-voice-id', voiceId);
};
