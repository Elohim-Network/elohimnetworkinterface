
import { AIServiceConfig } from './types';

// The official Mistral AI API endpoint with the correct domain
export const MISTRAL_API_URL = "https://agentelohim.com/v1/chat/completions";

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
  
  // Default configuration with the updated URL
  return {
    mistralUrl: MISTRAL_API_URL,
    stableDiffusionUrl: 'http://127.0.0.1:8188',
    mistralModel: 'mistral-7b-instruct',
    sdModel: 'stable-diffusion-v1-5',
    mistralApiKey: '' // Store API key in config
  };
};

// Save configuration to localStorage
export const saveConfig = (config: AIServiceConfig): void => {
  localStorage.setItem('local-ai-config', JSON.stringify(config));
};
