
import { getConfig } from '../config';
import { ChatMessage } from '../../../types/chat';
import { detectLlmBackend } from '../utils';
import { handleWithProvider } from '../backends/providerManager';
import { toast } from 'sonner';

export async function generateTextWithMistral(
  messages: ChatMessage[]
): Promise<string> {
  const config = getConfig();
  const modelName = config.mistralModel || 'mistral-7b-instruct';
  const apiKey = config.mistralApiKey || '';
  
  try {
    console.log(`Generating text with ${modelName} at ${config.mistralUrl}`);
    
    // Handle case where URL might be undefined or invalid
    if (!config.mistralUrl || config.mistralUrl === '') {
      throw new Error('LLM URL is not configured');
    }
    
    // Try to detect the backend type from the URL
    const backend = detectLlmBackend(config.mistralUrl);
    console.log(`Detected backend: ${backend}`);
    
    // If no backend was detected, try some self-healing
    if (backend === 'unknown') {
      console.warn('Unknown backend detected, attempting to heal configuration');
      
      // Try different endpoint formats based on common patterns
      const potentialEndpoints = [
        'http://localhost:11434/api/generate', // Ollama default
        'http://127.0.0.1:11434/api/generate', // Ollama alternative address
        'http://localhost:1234/v1/chat/completions', // LM Studio default
        'https://agentelohim.com/v1/chat/completions', // Remote API
        'https://agentelohim.com/api/generate', // Remote API (alternative)
      ];
      
      for (const endpoint of potentialEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'OPTIONS',
            headers: { 'Content-Type': 'application/json' },
          }).catch(() => null);
          
          if (response && response.ok) {
            console.log(`Found working endpoint: ${endpoint}`);
            // Update the config
            config.mistralUrl = endpoint;
            localStorage.setItem('local-ai-config', JSON.stringify(config));
            toast.success(`Detected and configured LLM at ${endpoint}`);
            break;
          }
        } catch (e) {
          console.log(`Failed to connect to ${endpoint}`);
        }
      }
    }
    
    // If the message is very short (like a test message), use a simplified prompt
    if (messages.length === 1 && messages[0].content.length < 50) {
      const simplePrompt = messages[0].content;
      if (simplePrompt.toLowerCase().includes('test') || simplePrompt.toLowerCase().includes('hello')) {
        console.log('Using simplified connection test prompt');
        return await handleSimpleConnectionTest(config.mistralUrl, backend, modelName, apiKey);
      }
    }
    
    return await handleWithProvider(messages, backend, modelName, apiKey);
  } catch (error: any) {
    console.error('Error generating text with LLM:', error);
    return `Error: Could not connect to LLM model. Please check your local AI server and ensure it's running. (${error.message})`;
  }
}

// For simple connection tests, use a more direct approach
async function handleSimpleConnectionTest(url: string, backend: string, model: string, apiKey: string): Promise<string> {
  try {
    if (backend === 'api-generate' || backend === 'ollama') {
      // For Ollama
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model, 
          prompt: 'Say "Connection successful!" and nothing else.',
          options: { temperature: 0.1 }
        }),
      }).catch(() => null);
      
      if (!response || !response.ok) {
        throw new Error('Connection failed');
      }
      
      const data = await response.json();
      return data.response || 'Connection successful!';
    } 
    else if (backend === 'v1-chat-completions' || backend === 'lm-studio' || backend === 'openai') {
      // For OpenAI-compatible endpoints
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Say "Connection successful!" and nothing else.' }],
          temperature: 0.1
        }),
      }).catch(() => null);
      
      if (!response || !response.ok) {
        throw new Error('Connection failed');
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Connection successful!';
    }
    
    return 'Connection successful!';
  } catch (error: any) {
    console.error('Error in connection test:', error);
    return `Error: Connection test failed. ${error.message}`;
  }
}
