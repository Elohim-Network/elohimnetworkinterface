
import { supabase } from '@/integrations/supabase/client';
import { OllamaRequest, OllamaResponse } from '@/types/chat';

/**
 * Service for interacting with the Ollama API through a Supabase Edge Function
 */
export const ollamaService = {
  /**
   * Generate a response from the Ollama API
   * 
   * @param model - The model to use for generation
   * @param prompt - The prompt to send to the model
   * @param systemPrompt - Optional system prompt to provide context
   * @returns The response from the model
   */
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

      const { data, error } = await supabase.functions.invoke('local-llm-proxy', {
        body: request,
      });

      if (error) {
        console.error('Error calling Ollama via Edge Function:', error);
        throw new Error(`Failed to generate response: ${error.message}`);
      }

      const response = data as OllamaResponse;
      return response.response;
    } catch (err) {
      console.error('Error in generateResponse:', err);
      return 'Sorry, I encountered an error while processing your request.';
    }
  }
};
