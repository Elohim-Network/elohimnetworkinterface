
// Local AI Service - Communicates with locally running AI models
// This service handles connections to various local LLMs and Stable Diffusion

interface MistralCompletionRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string[];
}

interface StableDiffusionRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
}

// Get the stored configuration or use defaults
const getConfig = () => {
  const savedConfig = localStorage.getItem('local-ai-config');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error('Error parsing saved config:', e);
    }
  }
  
  // Default configuration for Mac M1/M2
  return {
    mistralUrl: 'http://localhost:8080/v1/chat/completions',
    stableDiffusionUrl: 'http://localhost:7860/sdapi/v1/txt2img',
    mistralModel: 'mistral-7b',
    sdModel: 'stable-diffusion-v1-5'
  };
};

/**
 * Detect which LLM backend is being used based on URL
 * This helps format requests correctly for different APIs
 */
const detectLlmBackend = (url: string): 'openai-compatible' | 'ollama' | 'lmstudio' | 'unknown' => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('ollama')) {
    return 'ollama';
  } else if (lowerUrl.includes('lmstudio')) {
    return 'lmstudio';
  } else if (lowerUrl.includes('/v1/') || lowerUrl.includes('/chat/completions')) {
    return 'openai-compatible';
  }
  
  return 'unknown';
};

/**
 * Format messages for different LLM backend APIs
 */
const formatMessages = (
  messages: { role: string; content: string }[], 
  backend: 'openai-compatible' | 'ollama' | 'lmstudio' | 'unknown'
) => {
  switch (backend) {
    case 'openai-compatible':
      return messages;
    case 'ollama':
      // Ollama expects messages in OpenAI format but might have specific formatting
      return messages;
    case 'lmstudio':
      // LM Studio follows OpenAI format
      return messages;
    default:
      return messages;
  }
};

export async function generateTextWithMistral(
  messages: { role: string; content: string }[], 
  localApiUrl?: string
): Promise<string> {
  const config = getConfig();
  const apiUrl = localApiUrl || config.mistralUrl;
  const modelName = config.mistralModel || 'mistral-7b';
  
  try {
    console.log(`Generating text with ${modelName} at ${apiUrl}`);
    
    // Detect which backend we're working with
    const backend = detectLlmBackend(apiUrl);
    const formattedMessages = formatMessages(messages, backend);
    
    // Build request body according to the detected backend
    let requestBody: any = {};
    
    switch (backend) {
      case 'openai-compatible':
        requestBody = {
          model: modelName,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 800,
        };
        break;
      case 'ollama':
        requestBody = {
          model: modelName,
          messages: formattedMessages,
          options: {
            temperature: 0.7,
            num_predict: 800,
          }
        };
        break;
      case 'lmstudio':
      case 'unknown':
      default:
        requestBody = {
          model: modelName,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 800,
        };
        break;
    }
    
    // Send the request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('LLM API error:', errorData);
      throw new Error(`Failed to generate text: ${errorData}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Extract the generated text based on the detected backend
    let generatedText = '';
    
    switch (backend) {
      case 'openai-compatible':
        generatedText = data.choices[0]?.message?.content || 'No response generated';
        break;
      case 'ollama':
        generatedText = data.message?.content || data.response || 'No response generated';
        break;
      case 'lmstudio':
        generatedText = data.choices[0]?.message?.content || 'No response generated';
        break;
      default:
        generatedText = data.choices?.[0]?.message?.content || 
                        data.message?.content || 
                        data.response || 
                        'No response generated';
        break;
    }
    
    return generatedText;
  } catch (error) {
    console.error('Error generating text with local LLM:', error);
    return `Error: Could not connect to local LLM model. Please ensure your local server is running at ${apiUrl}`;
  }
}

export async function generateImageWithStableDiffusion(
  prompt: string,
  localApiUrl?: string
): Promise<string> {
  const config = getConfig();
  const apiUrl = localApiUrl || config.stableDiffusionUrl;
  const modelName = config.sdModel || 'stable-diffusion-v1-5';
  
  try {
    console.log(`Generating image with ${modelName} at ${apiUrl}`);
    
    // Basic configuration for Stable Diffusion
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: '',
        width: 512,
        height: 512,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        sampler_name: 'Euler a',
        model: modelName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Stable Diffusion API error:', errorData);
      throw new Error(`Failed to generate image: ${errorData}`);
    }

    const data = await response.json();
    
    // The response format may vary based on your Stable Diffusion API setup
    // Most APIs return a base64 encoded image
    const imageBase64 = data.images?.[0];
    if (!imageBase64) {
      throw new Error('No image data returned');
    }
    
    return `data:image/png;base64,${imageBase64}`;
  } catch (error) {
    console.error('Error generating image with local Stable Diffusion:', error);
    return `Error: Could not connect to local Stable Diffusion model. Please ensure your local server is running at ${apiUrl}`;
  }
}
