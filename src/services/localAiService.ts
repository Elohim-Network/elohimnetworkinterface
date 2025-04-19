
import { supabase } from '@/integrations/supabase/client';
import { OllamaRequest, OllamaResponse } from '@/types/chat';
import { detectLlmBackend } from '@/services/ai/utils';
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

      const config = { mistralUrl: 'http://127.0.0.1:11434/api/generate' };
      const backend = detectLlmBackend(config.mistralUrl);

      // Use type-safe comparison
      if (backend === 'api-generate') {
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

      return 'Unsupported backend';
    } catch (err) {
      console.error('Error in generateResponse:', err);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }
};
