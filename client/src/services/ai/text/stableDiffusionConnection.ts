
import { getConfig, saveConfig } from '../config';
import { ConnectionTestResult } from '../types';
import { toast } from 'sonner';

export async function testStableDiffusionConnection(): Promise<ConnectionTestResult> {
  try {
    const config = getConfig();
    const url = `${config.stableDiffusionUrl}`;
    
    // If URL is not provided, return error
    if (!url || url === '') {
      return {
        success: false,
        message: 'Stable Diffusion URL is not configured'
      };
    }
    
    console.log(`Testing connection to Stable Diffusion at ${url}`);
    
    // Try to access the primary URL
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => null);
    
    if (response && response.ok) {
      return {
        success: true,
        message: 'Successfully connected to Stable Diffusion!'
      };
    }
    
    // If primary connection fails, try common endpoint patterns
    const commonEndpoints = [
      // For AUTO1111
      `${url}/sdapi/v1/txt2img`,
      `${url}/api/txt2img`,
      `${url}/api`,
      
      // Try alternative hosts (localhost vs 127.0.0.1)
      url.includes('localhost') ? url.replace('localhost', '127.0.0.1') : url.replace('127.0.0.1', 'localhost'),
      
      // Try alternative ports
      url.includes('7860') ? url.replace('7860', '8188') : url.replace('8188', '7860'),
    ];
    
    // Try additional standard path formats
    const standardUrls = [
      "http://localhost:7860", 
      "http://127.0.0.1:7860", 
      "http://localhost:8188", 
      "http://127.0.0.1:8188"
    ];
    
    // Combine without duplicates
    const testUrls = [...new Set([...commonEndpoints, ...standardUrls])];
    
    // Test each URL
    for (const testUrl of testUrls) {
      try {
        console.log(`Trying alternative URL ${testUrl}`);
        const altResponse = await fetch(testUrl, {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (altResponse.ok) {
          // Update the config with working URL
          config.stableDiffusionUrl = testUrl;
          saveConfig(config);
          toast.success(`Found working SD endpoint: ${testUrl}`);
          
          return {
            success: true,
            message: `Successfully connected to Stable Diffusion at ${testUrl}!`
          };
        }
      } catch (error) {
        console.log(`Tried alternative URL ${testUrl}, but failed:`, error);
      }
    }
    
    // If all attempts failed
    return {
      success: false,
      message: 'Could not connect to Stable Diffusion API. Please ensure the server is running.'
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
}
