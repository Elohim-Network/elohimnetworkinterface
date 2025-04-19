
import { AIServiceConfig } from './types';

// Default endpoints for local models
export const LOCAL_ENDPOINTS = {
  OLLAMA: 'http://localhost:11434/api/generate',
  LM_STUDIO: 'http://localhost:1234/v1/chat/completions',
  AUTO1111: 'http://localhost:7860',
  COMFYUI: 'http://localhost:8188'
};

// Get the stored configuration or use defaults
export const getConfig = (): AIServiceConfig => {
  const savedConfig = localStorage.getItem('local-ai-config');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error('Error parsing saved config:', e);
    }
  }
  
  // Default configuration favoring local endpoints
  return {
    mistralUrl: LOCAL_ENDPOINTS.OLLAMA,
    stableDiffusionUrl: LOCAL_ENDPOINTS.AUTO1111,
    mistralModel: 'mistral',
    sdModel: 'stable-diffusion-v1-5',
    mistralApiKey: '',
    provider: 'ollama'
  };
};

// Save configuration to localStorage
export const saveConfig = (config: AIServiceConfig): void => {
  localStorage.setItem('local-ai-config', JSON.stringify(config));
};
