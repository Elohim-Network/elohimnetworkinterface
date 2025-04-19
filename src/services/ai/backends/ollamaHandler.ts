
import { ChatMessage } from '../../../types/chat';

export const ollamaHandler = async (
  messages: ChatMessage[],
  modelName: string
) => {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelName,
      messages,
      options: {
        temperature: 0.7,
        num_predict: 800,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || data.response || 'No response generated';
};
