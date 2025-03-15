
// Local AI Service - Communicates with locally running AI models
// This service handles connections to Mistral 7B and Stable Diffusion

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

export async function generateTextWithMistral(
  messages: { role: string; content: string }[], 
  localApiUrl = 'http://localhost:8080/v1/chat/completions'
): Promise<string> {
  try {
    // Formatting messages in the expected chat format
    const response = await fetch(localApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-7b', // This may vary depending on your local setup
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to generate text: ${errorData}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error generating text with local Mistral:', error);
    return `Error: Could not connect to local Mistral model. Please ensure your local server is running at ${localApiUrl}`;
  }
}

export async function generateImageWithStableDiffusion(
  prompt: string,
  localApiUrl = 'http://localhost:7860/sdapi/v1/txt2img'
): Promise<string> {
  try {
    // Basic configuration for Stable Diffusion
    const response = await fetch(localApiUrl, {
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
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
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
    return `Error: Could not connect to local Stable Diffusion model. Please ensure your local server is running at ${localApiUrl}`;
  }
}
