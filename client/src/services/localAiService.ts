
import { supabase } from '@/integrations/supabase/client';
import { OllamaRequest, OllamaResponse } from '@/types/chat';
import { detectLlmBackend } from '@/services/ai/utils';
import { getConfig } from '@/services/ai/config';
import { ProviderType } from '@/services/ai/types';

export const ollamaService = {
  async generateResponse(model: string, prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const request: OllamaRequest = {
        model,
        prompt,
        system: systemPrompt,
        options: {
          temperature: 0.7,
        }
      };

      const config = getConfig();
      const backend = detectLlmBackend(config.mistralUrl);

      if (backend === 'api-generate' || backend === 'ollama') {
        // For direct Ollama connection (localhost)
        try {
          const response = await fetch(`${config.mistralUrl}/api/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
          });

          if (!response.ok) {
            throw new Error(`Failed to connect to local Ollama: ${response.statusText}`);
          }

          const data = await response.json();
          return data.response;
        } catch (localError) {
          console.error('Error connecting directly to Ollama:', localError);
          
          // Fall back to Edge Function if direct connection fails
          console.log('Falling back to Edge Function...');
          const { data, error } = await supabase.functions.invoke('local-llm-proxy', {
            body: request,
          });

          if (error) {
            console.error('Error calling Ollama via Edge Function:', error);
            throw new Error(`Failed to generate response: ${error.message}`);
          }

          const response = data as OllamaResponse;
          return response.response;
        }
      }

      // Handle non-Ollama backends (OpenAI compatible, etc)
      return 'Unsupported backend or connection failed. Please check your local AI configuration.';
    } catch (err) {
      console.error('Error in generateResponse:', err);
      return 'Sorry, I encountered an error connecting to your local Agent Elohim. Please ensure your local Ollama server is running and accessible.';
    }
  }
};
