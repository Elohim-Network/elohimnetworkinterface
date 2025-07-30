
import { ProviderType, ModelFormat, LocalModelConfig, LOCAL_MODEL_CONFIGS } from './types';

export const detectLlmBackend = (url: string): ProviderType => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('mistral.ai') || lowerUrl.includes('agentelohim.com')) {
    return 'mistral-cloud';
  } else if (lowerUrl.includes('ollama') || lowerUrl.includes(':11434')) {
    return 'ollama';
  } else if (lowerUrl.includes('lmstudio') || lowerUrl.includes(':1234')) {
    return 'lmstudio';
  } else if (lowerUrl.includes('/api/generate')) {
    return 'api-generate';
  } else if (lowerUrl.includes('/v1/') || lowerUrl.includes('/chat/completions')) {
    return 'openai-compatible';
  }
  
  return 'unknown';
};

export const formatMessages = (
  messages: { role: string; content: string }[], 
  backend: ProviderType,
  model?: string
) => {
  if (backend === 'ollama') {
    // Ollama specific format
    const modelConfig = model ? LOCAL_MODEL_CONFIGS[model.toLowerCase()] : null;
    if (modelConfig?.format === 'completion') {
      // For completion-only models, just send the last message
      const lastMessage = messages[messages.length - 1];
      return lastMessage.content;
    }
  }
  
  if (backend === 'api-generate') {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    return lastUserMessage ? lastUserMessage.content : messages[messages.length - 1].content;
  }
  
  // For all other backends, return the full messages array
  return messages;
};

// Detect if running locally
export const isLocalEndpoint = (url: string): boolean => {
  return url.includes('localhost') || url.includes('127.0.0.1');
};

// Get model configuration
export const getModelConfig = (modelName: string): LocalModelConfig | undefined => {
  return LOCAL_MODEL_CONFIGS[modelName.toLowerCase()];
};
