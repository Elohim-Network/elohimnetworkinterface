
import { getConfig } from './config';

/**
 * Generate an image using Stable Diffusion
 */
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

/**
 * Test the connection to the Stable Diffusion API
 */
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
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
}
