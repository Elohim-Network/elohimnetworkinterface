
// Direct Ollama API service for local connections
interface OllamaRequest {
  model: string;
  prompt: string;
  system?: string;
  options?: {
    temperature?: number;
  };
}

interface OllamaResponse {
  response: string;
}

/**
 * Service for interacting with local Ollama API directly
 */
export const ollamaService = {
  /**
   * Generate a response from the local Ollama API
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

      const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to connect to local Ollama: ${response.statusText}`);
      }

      const data = await response.json() as OllamaResponse;
      return data.response;
    } catch (err) {
      console.error('Error in generateResponse:', err);
      return 'Sorry, I encountered an error connecting to your local Ollama server. Please ensure it is running and accessible.';
    }
  }
};
