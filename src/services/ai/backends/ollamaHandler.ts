
import { ChatMessage } from '../../../types/chat';
import { getConfig } from '../config';

export async function ollamaHandler(messages: ChatMessage[], model: string): Promise<string> {
  const config = getConfig();
  const url = `${config.mistralUrl}/api/generate`;
  
  // Format messages for Ollama
  // Ollama expects just the last message as prompt, with previous ones in the context
  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage.content;
  
  // Create system prompt from previous assistant messages to maintain personality
  let systemPrompt = "You are Agent Elohim, a helpful AI assistant with access to local models. " +
    "You have knowledge on various topics and can assist with a wide range of tasks. " +
    "As Agent Elohim, you are friendly, informative, and strive to provide accurate and helpful responses.";
  
  // Build context from previous messages if any
  const previousMessages = messages.slice(0, -1);
  let context = "";
  if (previousMessages.length > 0) {
    context = previousMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    if (context) {
      systemPrompt += "\n\nHere's the conversation history:\n" + context;
    }
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        system: systemPrompt,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to connect to local Ollama: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error('Error in ollamaHandler:', error);
    return `Error connecting to your local Agent Elohim. Please ensure your Ollama server is running and accessible at ${config.mistralUrl}. Error: ${error.message}`;
  }
}
