import { ModelConfig } from '../types';

const SLEEP_MS = 1500; // Poll interval

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Use our own Cloudflare Worker as a proxy to avoid CORS issues
// The worker proxies requests to the Replicate API server-side
const API_BASE = '/api/replicate';

interface Prediction {
  id: string;
  status: string;
  output?: string | string[];
  error?: string;
  urls: {
    get: string;
    cancel: string;
  };
}

export const createPrediction = async (
  apiKey: string,
  model: ModelConfig,
  input: { prompt: string; image?: string; aspect_ratio?: string }
): Promise<Prediction> => {
  const payloadInput: any = {
    prompt: input.prompt,
    output_format: 'png',
  };

  if (input.aspect_ratio) {
    payloadInput.aspect_ratio = input.aspect_ratio;
  }

  // Handle Input Image mapping based on model specific requirements
  if (input.image) {
    // 1. Flux models (black-forest-labs) accept "input_images" as a list
    if (model.owner === 'black-forest-labs') {
      payloadInput.input_images = [input.image];
    }
    // 2. Models that accept "image" as a string
    else if (
      (model.owner === 'reve' && (model.name === 'edit' || model.name === 'edit-fast')) ||
      (model.owner === 'qwen' && model.name === 'qwen-image-edit') ||
      (model.owner === 'bytedance' && model.name === 'seededit-3.0')
    ) {
      payloadInput.image = input.image;
    } 
    // 3. Models that accept "image" as a list
    else if (model.owner === 'qwen' && model.name === 'qwen-image-edit-plus') {
      payloadInput.image = [input.image];
    } 
    // 4. All others accept "image_input" as a list param
    else {
      payloadInput.image_input = [input.image];
    }
  }

  // Use our worker proxy endpoint
  const url = `${API_BASE}/v1/models/${model.owner}/${model.name}/predictions`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: payloadInput }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 404) {
        throw new Error(`Model not found (${model.owner}/${model.name}). Check model ID.`);
      }
      if (response.status === 401) {
        throw new Error("Invalid API Key.");
      }
      if (response.status === 422) {
        throw new Error(`Invalid inputs for this model.`);
      }
      throw new Error(`Replicate Error (${response.status}): ${errorBody}`);
    }

    const prediction = await response.json();
    return prediction;
  } catch (err: any) {
    if (err.message === 'Failed to fetch') {
      throw new Error("Network error. Please check your connection and try again.");
    }
    throw err;
  }
};

export const pollPrediction = async (apiKey: string, predictionUrl: string): Promise<Prediction> => {
  // Convert the full Replicate URL to use our worker proxy
  // predictionUrl is like: https://api.replicate.com/v1/predictions/xxx
  const proxyPath = predictionUrl.replace('https://api.replicate.com', API_BASE);

  while (true) {
    const response = await fetch(proxyPath, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        await sleep(SLEEP_MS * 2);
        continue;
      }
      throw new Error(`Polling failed: ${response.status}`);
    }

    const prediction = await response.json();

    if (prediction.status === 'succeeded') {
      return prediction;
    } else if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(`Prediction ${prediction.status}: ${prediction.error || 'Unknown error'}`);
    }

    await sleep(SLEEP_MS);
  }
};
