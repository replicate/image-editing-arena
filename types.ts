export interface ModelConfig {
  id: string;
  name: string;
  owner: string;
  version?: string; // Optional specific version hash
  type: 'image-generation' | 'image-editing';
  description: string;
  price: number;
}

export interface PredictionResult {
  modelId: string;
  status: 'idle' | 'starting' | 'processing' | 'succeeded' | 'failed';
  output?: string | string[]; // URL or array of URLs
  error?: string;
  inferenceTime?: number; // in seconds
}

export interface PredictionStats {
  modelId: string;
  time: number;
}