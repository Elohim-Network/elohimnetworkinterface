
import { getConfig } from '../config';
import { ChatMessage } from '../../../types/chat';
import { detectLlmBackend } from '../utils';
import { mistralCloudHandler } from '../backends/mistralCloud';
import { ollamaHandler } from '../backends/ollamaHandler';
import { openAiCompatibleHandler } from '../backends/openAiCompatible';

export async function generateTextWithMistral(
  messages: ChatMessage[]
): Promise<string> {
  const config = getConfig();
  const modelName = config.mistralModel || 'mistral-7b-instruct';
  const apiKey = config.mistralApiKey || '';
  
  try {
    console.log(`Generating text with ${modelName} at ${config.mistralUrl}`);
    
    const backend = detectLlmBackend(config.mistralUrl);
    console.log(`Detected backend: ${backend}`);
    
    switch (backend) {
      case 'mistral-cloud':
        return await mistralCloudHandler(messages, modelName, apiKey);
      case 'ollama':
        return await ollamaHandler(messages, modelName);
      case 'openai-compatible':
        return await openAiCompatibleHandler(messages, modelName, apiKey);
      case 'api-generate':
        // For api-generate endpoint, only use the last message
        const lastMessage = messages[messages.length - 1];
        return await ollamaHandler([lastMessage], modelName);
      default:
        return await openAiCompatibleHandler(messages, modelName, apiKey);
    }
  } catch (error: any) {
    console.error('Error generating text with LLM:', error);
    return `Error: Could not connect to LLM model. Please ensure your API endpoint and key are correct.`;
  }
}
