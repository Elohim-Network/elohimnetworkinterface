
// AI Service Types
export type ProviderType = 'mistral-cloud' | 'openai-compatible' | 'ollama' | 'lmstudio' | 'api-generate' | 'unknown';

// Status types for the diagnostics tool
export type StatusType = 'unknown' | 'connected' | 'disconnected' | 'fixing';
export type StorageStatusType = 'unknown' | 'available' | 'unavailable' | 'fixing';

export interface MistralCompletionRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stop?: string[];
}

export interface StableDiffusionRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export interface AIServiceConfig {
  mistralUrl: string;
  stableDiffusionUrl: string;
  mistralModel: string;
  sdModel: string;
  mistralApiKey: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
}
