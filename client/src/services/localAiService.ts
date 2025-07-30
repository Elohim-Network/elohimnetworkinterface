
// Local AI service for direct connections without external dependencies
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

const getConfig = () => {
  const savedConfig = localStorage.getItem('local-ai-config');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error('Error parsing saved config:', e);
    }
  }
  
  return {
    mistralUrl: 'http://127.0.0.1:11434',
    stableDiffusionUrl: 'http://127.0.0.1:8188',
    mistralModel: 'mistral-7b-instruct',
    sdModel: 'stable-diffusion-v1-5'
  };
};

const detectLlmBackend = (url: string) => {
  if (url.includes('11434') || url.includes('ollama')) {
    return 'ollama';
  }
  if (url.includes('/api/generate')) {
    return 'api-generate';
  }
  return 'openai-compatible';
};

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
          
          // Local connection failed
          throw new Error('Cannot connect to local AI service. Please ensure Ollama is running.');
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
