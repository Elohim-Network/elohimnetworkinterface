
import { getConfig } from '../config';
import { ConnectionTestResult } from '../types';

export async function testStableDiffusionConnection(): Promise<ConnectionTestResult> {
  try {
    const config = getConfig();
    const url = `${config.stableDiffusionUrl}`;
    
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => null);
    
    if (!response) {
      // Try another common endpoint
      const testUrls = [
        `${config.stableDiffusionUrl}/sdapi/v1/txt2img`,
        `${config.stableDiffusionUrl}/api/txt2img`,
        `${config.stableDiffusionUrl}/api`
      ];
      
      for (const testUrl of testUrls) {
        try {
          const altResponse = await fetch(testUrl, {
            method: 'OPTIONS',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (altResponse.ok) {
            return {
              success: true,
              message: 'Successfully connected to Stable Diffusion!'
            };
          }
        } catch (error) {
          console.log(`Tried alternative URL ${testUrl}, but failed:`, error);
        }
      }
      
      return {
        success: false,
        message: 'Could not connect to Stable Diffusion API. Please ensure the server is running.'
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Stable Diffusion!'
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
}
