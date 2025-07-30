
import { generateTextWithMistral } from './textGeneration';
import { ConnectionTestResult } from '../types';

export async function testMistralConnection(): Promise<ConnectionTestResult> {
  try {
    const response = await generateTextWithMistral([
      { role: 'user', content: 'Hello, this is a connection test.' }
    ]);
    
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
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
}
