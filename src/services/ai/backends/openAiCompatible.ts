
import { ChatMessage } from '../../../types/chat';

export const openAiCompatibleHandler = async (
  messages: ChatMessage[],
  modelName: string,
  apiKey?: string
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch('/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: modelName,
      messages,
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI Compatible API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
};
