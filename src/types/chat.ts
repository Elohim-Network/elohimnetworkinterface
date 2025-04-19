
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: number;
  isLoading?: boolean;
  type?: 'text' | 'image'; // To differentiate between text and image responses
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  system?: string;
  template?: string;
  context?: number[];
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
  };
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}
