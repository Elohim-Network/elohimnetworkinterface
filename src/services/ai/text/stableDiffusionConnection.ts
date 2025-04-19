
import { getConfig } from '../config';
import { ConnectionTestResult } from '../types';

export async function testStableDiffusionConnection(): Promise<ConnectionTestResult> {
  try {
    const config = getConfig();
    const response = await fetch(`${config.stableDiffusionUrl}/sdapi/v1/txt2img`, {
      method: 'OPTIONS',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => null);
    
    if (response && response.ok) {
      return {
        success: true,
        message: 'Successfully connected to Stable Diffusion API!'
      };
    }
    
    return {
      success: false,
      message: 'Failed to connect to Stable Diffusion API'
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
}
