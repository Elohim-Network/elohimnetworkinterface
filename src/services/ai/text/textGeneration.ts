
import { getConfig } from '../config';
import { ChatMessage } from '../../../types/chat';
import { detectLlmBackend } from '../utils';
import { handleWithProvider } from '../backends/providerManager';

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
    
    return await handleWithProvider(messages, backend, modelName, apiKey);
  } catch (error: any) {
    console.error('Error generating text with LLM:', error);
    return `Error: Could not connect to LLM model. Please check your local Ollama server and ensure it's running.`;
  }
}
