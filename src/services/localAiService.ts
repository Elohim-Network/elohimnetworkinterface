
// Local AI Service - Communicates with locally running AI models or cloud-based APIs like Mistral
// This service handles connections to various LLMs and Stable Diffusion

// The official Mistral AI API endpoint with the correct domain
const MISTRAL_API_URL = "https://agentelohim.com/v1/chat/completions";

interface MistralCompletionRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
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
  
  // Default configuration with the updated URL
  return {
    mistralUrl: MISTRAL_API_URL,
    stableDiffusionUrl: 'http://127.0.0.1:8188',
    mistralModel: 'mistral-7b-instruct',
    sdModel: 'stable-diffusion-v1-5',
    mistralApiKey: '' // Store API key in config
  };
};

/**
 * Detect which LLM backend is being used based on URL
 * This helps format requests correctly for different APIs
 */
const detectLlmBackend = (url: string): 'mistral-cloud' | 'openai-compatible' | 'ollama' | 'lmstudio' | 'unknown' => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('mistral.ai') || lowerUrl.includes('agentelohim.com')) {
    return 'mistral-cloud';
  } else if (lowerUrl.includes('ollama')) {
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
  backend: 'mistral-cloud' | 'openai-compatible' | 'ollama' | 'lmstudio' | 'unknown'
) => {
  // For now, all services use the same message format
  return messages;
};

export async function generateTextWithMistral(
  messages: { role: string; content: string }[], 
  localApiUrl?: string
): Promise<string> {
  const config = getConfig();
  const apiUrl = localApiUrl || config.mistralUrl;
  const modelName = config.mistralModel || 'mistral-7b-instruct';
  const apiKey = config.mistralApiKey || '';
  
  try {
    console.log(`Generating text with ${modelName} at ${apiUrl}`);
    
    // Detect which backend we're working with
    const backend = detectLlmBackend(apiUrl);
    const formattedMessages = formatMessages(messages, backend);
    
    // Build request body according to the detected backend
    let requestBody: any = {};
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    switch (backend) {
      case 'mistral-cloud':
        // Mistral Cloud API requires an API key
        if (!apiKey) {
          return "Error: Mistral Cloud API requires an API key. Please add your API key in the settings.";
        }
        headers['Authorization'] = `Bearer ${apiKey}`;
        requestBody = {
          model: modelName,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 800,
        };
        break;
      case 'openai-compatible':
        // Add API key if available
        if (apiKey) {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }
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
    console.log(`Sending request to ${apiUrl} with headers:`, headers);
    console.log("Request body:", JSON.stringify(requestBody));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorStatus = response.status;
      let errorData;
      try {
        errorData = await response.text();
      } catch (e) {
        errorData = "Could not parse error response";
      }
      console.error(`LLM API error (${errorStatus}):`, errorData);
      if (errorStatus === 403) {
        return `Error: Access forbidden (403). This could be due to an invalid API key, insufficient permissions, or request restrictions. Please check your API key in settings.`;
      }
      throw new Error(`Failed to generate text: ${errorData} (Status: ${errorStatus})`);
    }

    // Parse the response
    const data = await response.json();
    console.log("API response data:", data);
    
    // Extract the generated text based on the detected backend
    let generatedText = '';
    
    switch (backend) {
      case 'mistral-cloud':
      case 'openai-compatible':
        generatedText = data.choices?.[0]?.message?.content || 'No response generated';
        break;
      case 'ollama':
        generatedText = data.message?.content || data.response || 'No response generated';
        break;
      case 'lmstudio':
        generatedText = data.choices?.[0]?.message?.content || 'No response generated';
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
    console.error('Error generating text with LLM:', error);
    return `Error: Could not connect to LLM model. Please ensure your API endpoint and key are correct.`;
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
    
    // ComfyUI has a different API structure than Automatic1111
    // Check if we're using ComfyUI based on the endpoint
    const isComfyUI = apiUrl.includes('8188');
    
    if (isComfyUI) {
      // ComfyUI workflow structure - simplified example
      const comfyWorkflow = {
        "prompt": {
          "3": { // KSampler node
            "inputs": {
              "seed": Math.floor(Math.random() * 1000000),
              "steps": 30,
              "cfg": 7.5,
              "sampler_name": "euler_ancestral",
              "scheduler": "normal",
              "denoise": 1.0,
              "model": ["4", 0], // Reference to model node output
              "positive": ["6", 0], // Reference to CLIP Text Encode node (positive prompt)
              "negative": ["7", 0], // Reference to CLIP Text Encode node (negative prompt)
              "latent_image": ["5", 0] // Reference to empty latent node output
            }
          },
          "4": { // CheckpointLoaderSimple node
            "inputs": {
              "ckpt_name": modelName
            }
          },
          "5": { // EmptyLatentImage node
            "inputs": {
              "width": 512,
              "height": 512,
              "batch_size": 1
            }
          },
          "6": { // CLIPTextEncode node for positive prompt
            "inputs": {
              "text": prompt,
              "clip": ["4", 1] // Reference to model CLIP output
            }
          },
          "7": { // CLIPTextEncode node for negative prompt
            "inputs": {
              "text": "blurry, bad quality, worst quality, low quality",
              "clip": ["4", 1] // Reference to model CLIP output
            }
          },
          "8": { // VAEDecode node
            "inputs": {
              "samples": ["3", 0], // Reference to KSampler output
              "vae": ["4", 2] // Reference to model VAE output
            }
          },
          "9": { // SaveImage node
            "inputs": {
              "images": ["8", 0], // Reference to VAEDecode output
              "filename_prefix": "ComfyUI"
            }
          }
        }
      };

      // First, we need to queue the workflow
      const queueResponse = await fetch(`${apiUrl}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comfyWorkflow),
      });

      if (!queueResponse.ok) {
        throw new Error('Failed to queue ComfyUI workflow');
      }

      const queueData = await queueResponse.json();
      const promptId = queueData.prompt_id;

      // Poll for completion
      let finished = false;
      let imageData = null;
      
      // Try for 60 seconds (120 polls at 500ms interval)
      for (let i = 0; i < 120; i++) {
        // Wait 500ms between polls
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check history for our prompt
        const historyResponse = await fetch(`${apiUrl}/history/${promptId}`);
        if (!historyResponse.ok) continue;
        
        const history = await historyResponse.json();
        if (!history[promptId] || !history[promptId].outputs) continue;
        
        // Look for the SaveImage node output
        const outputs = history[promptId].outputs;
        if (outputs["9"] && outputs["9"].images && outputs["9"].images.length > 0) {
          const imageName = outputs["9"].images[0].filename;
          // Get the image
          const imageResponse = await fetch(`${apiUrl.replace('/prompt', '')}/view?filename=${imageName}`);
          if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            const reader = new FileReader();
            await new Promise<void>((resolve, reject) => {
              reader.onloadend = () => {
                imageData = reader.result;
                finished = true;
                resolve();
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            break;
          }
        }
      }
      
      if (!finished || !imageData) {
        throw new Error('Timed out waiting for ComfyUI to generate image');
      }
      
      return imageData.toString();
    } else {
      // Original code for Automatic1111
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
    }
  } catch (error) {
    console.error('Error generating image with local Stable Diffusion:', error);
    return `Error: Could not connect to local Stable Diffusion model. Please ensure your local server is running at ${apiUrl}`;
  }
}

// Add a function to update the API key in the config
export function updateMistralApiKey(apiKey: string): void {
  const config = getConfig();
  config.mistralApiKey = apiKey;
  localStorage.setItem('local-ai-config', JSON.stringify(config));
}

// Add a function to test the connection to the Mistral API
export async function testMistralConnection(): Promise<{success: boolean, message: string}> {
  try {
    const config = getConfig();
    const response = await generateTextWithMistral([{role: 'user', content: 'Hello, this is a connection test.'}]);
    
    if (response.includes('Error:')) {
      return {
        success: false,
        message: response
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Mistral API!'
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
}

// Add a function to test the connection to the Stable Diffusion API
export async function testStableDiffusionConnection(): Promise<{success: boolean, message: string}> {
  try {
    const response = await generateImageWithStableDiffusion('A simple test image of a blue circle');
    
    if (response.includes('Error:')) {
      return {
        success: false,
        message: response
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Stable Diffusion API!'
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
}
