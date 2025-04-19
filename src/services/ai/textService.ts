import { getConfig } from './config';
import { detectLlmBackend, formatMessages } from './utils';
import { ProviderType, ConnectionTestResult } from './types';

/**
 * Generate text using Mistral or other LLM models
 */
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
    console.log(`Detected backend: ${backend}`);
    
    // Special case for /api/generate endpoint which uses a different format
    if (backend === 'api-generate') {
      const lastMessageContent = formatMessages(messages, backend) as string;
      console.log("Using /api/generate endpoint format with content:", lastMessageContent);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: lastMessageContent,
          model: modelName,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });
      
      if (!response.ok) {
        const errorStatus = response.status;
        const errorData = await response.text();
        throw new Error(`Failed to generate text: ${errorData} (Status: ${errorStatus})`);
      }
      
      const data = await response.json();
      return data.response || data.text || data.generated_text || 'No response generated';
    }
    
    // Standard handling for other API formats
    const formattedMessages = formatMessages(messages, backend) as Array<{ role: string; content: string }>;
    
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
      
      // If we get a 404 or other error and we're not using the /api/generate endpoint,
      // try falling back to it
      if (backend !== 'api-generate' && !apiUrl.includes('/api/generate')) {
        console.log("Trying fallback to /api/generate endpoint");
        // Construct fallback URL by replacing the endpoint or adding it
        const fallbackUrl = apiUrl.includes('/v1') 
          ? apiUrl.replace(/\/v1\/.*$/, '/api/generate') 
          : `${apiUrl}/api/generate`.replace(/\/\//g, '/');
        
        console.log(`Fallback URL: ${fallbackUrl}`);
        return generateTextWithMistral(messages, fallbackUrl);
      }
      
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
                        data.generated_text ||
                        'No response generated';
        break;
    }
    
    return generatedText;
  } catch (error: any) {
    console.error('Error generating text with LLM:', error);
    return `Error: Could not connect to LLM model. Please ensure your API endpoint and key are correct.`;
  }
}

/**
 * Test the connection to the Mistral API
 */
export async function testMistralConnection(): Promise<ConnectionTestResult> {
  try {
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
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
}

/**
 * Update the Mistral API key in the config
 */
export function updateMistralApiKey(apiKey: string): void {
  const config = getConfig();
  config.mistralApiKey = apiKey;
  localStorage.setItem('local-ai-config', JSON.stringify(config));
}
