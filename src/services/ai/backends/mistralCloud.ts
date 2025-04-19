
import { getConfig } from '../config';
import { ChatMessage } from '../../../types/chat';

export const mistralCloudHandler = async (
  messages: ChatMessage[],
  modelName: string,
  apiKey: string
) => {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral Cloud API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
};
