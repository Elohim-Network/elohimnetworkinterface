
import { ChatMessage } from '../../../types/chat';
import { ProviderType } from '../types';
import { getConfig } from '../config';
import { mistralCloudHandler } from './mistralCloud';
import { ollamaHandler } from './ollamaHandler';
import { openAiCompatibleHandler } from './openAiCompatible';

/**
 * Handles routing requests to the appropriate LLM backend based on provider type
 */
export async function handleWithProvider(
  messages: ChatMessage[],
  providerType: ProviderType,
  modelName: string = '',
  apiKey: string = ''
): Promise<string> {
  const config = getConfig();
  
  // Use provided model name or fall back to config
  const model = modelName || config.mistralModel || 'mistral-7b-instruct';
  // Use provided API key or fall back to config
  const key = apiKey || config.mistralApiKey || '';

  switch (providerType) {
    case 'mistral-cloud':
      return await mistralCloudHandler(messages, model, key);
    
    case 'ollama':
      return await ollamaHandler(messages, model);
    
    case 'openai-compatible':
      return await openAiCompatibleHandler(messages, model, key);
    
    case 'api-generate':
      // For api-generate endpoint, only use the last message
      const lastMessage = messages[messages.length - 1];
      return await ollamaHandler([lastMessage], model);
    
    case 'lmstudio':
      // LM Studio uses OpenAI compatible API
      return await openAiCompatibleHandler(messages, model, key);
    
    default:
      throw new Error(`Unsupported provider type: ${providerType}`);
  }
}
