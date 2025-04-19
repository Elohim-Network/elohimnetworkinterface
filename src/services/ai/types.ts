
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
  provider?: ProviderType;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  provider?: ProviderType;
}

export type ModelFormat = 'chat' | 'completion' | 'generate';

export interface LocalModelConfig {
  name: string;
  format: ModelFormat;
  contextLength: number;
  provider: ProviderType;
}

export const LOCAL_MODEL_CONFIGS: Record<string, LocalModelConfig> = {
  'llama2': {
    name: 'llama2',
    format: 'chat',
    contextLength: 4096,
    provider: 'ollama'
  },
  'mistral': {
    name: 'mistral',
    format: 'chat',
    contextLength: 8192,
    provider: 'ollama'
  },
  'codellama': {
    name: 'codellama',
    format: 'completion',
    contextLength: 16384,
    provider: 'ollama'
  }
};
