
export { generateTextWithMistral } from './text/textGeneration';
export { testMistralConnection } from './text/connectionTest';

import { getConfig, saveConfig } from './config';

export function updateMistralApiKey(apiKey: string): void {
  const config = getConfig();
  config.mistralApiKey = apiKey;
  saveConfig(config);
}
