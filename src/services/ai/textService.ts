
export { generateTextWithMistral } from './text/textGeneration';
export { testMistralConnection } from './text/connectionTest';

export function updateMistralApiKey(apiKey: string): void {
  const config = getConfig();
  config.mistralApiKey = apiKey;
  localStorage.setItem('local-ai-config', JSON.stringify(config));
}
