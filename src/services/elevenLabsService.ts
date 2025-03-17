
/**
 * Service for interacting with ElevenLabs voice API
 */

interface VoiceInfo {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  isCustom?: boolean;
}

// Get stored API key
const getApiKey = () => {
  return localStorage.getItem('elevenlabs-api-key') || '';
};

// Set API key
export const setApiKey = (apiKey: string) => {
  localStorage.setItem('elevenlabs-api-key', apiKey);
};

// Get the default voice ID (or stored preference)
export const getDefaultVoiceId = () => {
  return localStorage.getItem('elevenlabs-voice-id') || 'EXAVITQu4vr4xnSDxMaL'; // Sarah as default
};

// Set the default voice ID
export const setDefaultVoiceId = (voiceId: string) => {
  localStorage.setItem('elevenlabs-voice-id', voiceId);
};

// Get available voices
export const getVoices = async (): Promise<VoiceInfo[]> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("ElevenLabs API key is required");
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    const data = await response.json();
    return data.voices.map((voice: any) => ({
      voice_id: voice.voice_id,
      name: voice.name,
      category: voice.category,
      description: voice.description || '',
      isCustom: voice.category === 'cloned',
    }));
  } catch (error) {
    console.error('Error fetching voices:', error);
    return getDefaultVoices();
  }
};

// Clone a voice from a sample
export const cloneVoice = async (
  name: string, 
  description: string, 
  files: File[]
): Promise<VoiceInfo | null> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("ElevenLabs API key is required");
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to clone voice');
    }

    const data = await response.json();
    return {
      voice_id: data.voice_id,
      name: data.name,
      description: data.description || '',
      isCustom: true,
    };
  } catch (error) {
    console.error('Error cloning voice:', error);
    return null;
  }
};

// Delete a voice
export const deleteVoice = async (voiceId: string): Promise<boolean> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("ElevenLabs API key is required");
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
      method: 'DELETE',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting voice:', error);
    return false;
  }
};

// Get pre-made voices (fallback for when API isn't available)
export const getDefaultVoices = (): VoiceInfo[] => {
  return [
    { voice_id: '9BWtsMINqrJLrRacOk9x', name: 'Aria' },
    { voice_id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger' },
    { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
    { voice_id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura' },
    { voice_id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie' },
    { voice_id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George' },
    { voice_id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum' },
    { voice_id: 'SAz9YHcvj6GT2YYXdXww', name: 'River' },
    { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam' },
    { voice_id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte' },
    { voice_id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice' },
    { voice_id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda' },
    { voice_id: 'bIHbv24MWmeRgasZH58o', name: 'Will' },
    { voice_id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica' },
    { voice_id: 'cjVigY5qzO86Huf0OWal', name: 'Eric' },
    { voice_id: 'iP95p4xoKVk53GoZ742B', name: 'Chris' },
    { voice_id: 'nPczCjzI2devNBz1zQrb', name: 'Brian' },
    { voice_id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel' },
    { voice_id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily' },
    { voice_id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill' },
  ];
};

// Text-to-speech using a specific voice
export const textToSpeech = async (text: string, voiceId?: string): Promise<ArrayBuffer | null> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("ElevenLabs API key is required");
    }

    const selectedVoiceId = voiceId || getDefaultVoiceId();
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to convert text to speech');
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error converting text to speech:', error);
    return null;
  }
};
