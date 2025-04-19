
import { ProviderType } from './types';

/**
 * Detect which LLM backend is being used based on URL
 * This helps format requests correctly for different APIs
 */
export const detectLlmBackend = (url: string): ProviderType => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('mistral.ai') || lowerUrl.includes('agentelohim.com')) {
    return 'mistral-cloud';
  } else if (lowerUrl.includes('ollama')) {
    return 'ollama';
  } else if (lowerUrl.includes('lmstudio')) {
    return 'lmstudio';
  } else if (lowerUrl.includes('/api/generate')) {
    return 'api-generate';
  } else if (lowerUrl.includes('/v1/') || lowerUrl.includes('/chat/completions')) {
    return 'openai-compatible';
  }
  
  return 'unknown';
};

/**
 * Format messages for different LLM backend APIs
 */
export const formatMessages = (
  messages: { role: string; content: string }[], 
  backend: ProviderType
) => {
  // For most APIs, we use the standard message format
  if (backend === 'api-generate') {
    // Special case for /api/generate endpoint which may have a different format
    // Extract just the last user message content for simple API endpoints
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    return lastUserMessage ? lastUserMessage.content : messages[messages.length - 1].content;
  }
  
  // For all other backends, return the full messages array
  return messages;
};
