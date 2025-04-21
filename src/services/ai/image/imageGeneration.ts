
import { getConfig } from '../config';

export async function generateImageWithStableDiffusion(prompt: string): Promise<string> {
  try {
    const config = getConfig();
    const response = await fetch(`${config.stableDiffusionUrl}/sdapi/v1/txt2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: "worst quality, blurry, low resolution",
        steps: 20,
        width: 512,
        height: 512,
        cfg_scale: 7.0,
        seed: -1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const result = await response.json();
    const imageBase64 = result.images?.[0];
    
    if (!imageBase64) {
      throw new Error('No image data received from Stable Diffusion');
    }
    
    return `data:image/png;base64,${imageBase64}`;
  } catch (error: any) {
    console.error('Error generating image with Stable Diffusion:', error);
    return `Error: Failed to generate image. ${error.message}`;
  }
}
