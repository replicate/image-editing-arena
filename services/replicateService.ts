import { ModelConfig } from '../types';

const SLEEP_MS = 1500; // Increased poll interval slightly to be nicer to the rate limits

// We use a CORS proxy to bypass the browser's restriction on calling api.replicate.com directly.
// In a production app, you would proxy these requests through your own backend.
const PROXY_URL = "https://corsproxy.io/?";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const createPrediction = async (
  apiKey: string,
  model: ModelConfig,
  input: { prompt: string; image?: string; aspect_ratio?: string }
) => {
  const headers = {
    Authorization: `Token ${apiKey}`,
    'Content-Type': 'application/json',
    // Some proxies require extra headers, but corsproxy.io usually works with standard ones
  };

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
    // - reve/edit, reve/edit-fast
    // - qwen/qwen-image-edit (NOT plus)
    // - bytedance/seededit-3.0
    else if (
        (model.owner === 'reve' && (model.name === 'edit' || model.name === 'edit-fast')) ||
        (model.owner === 'qwen' && model.name === 'qwen-image-edit') ||
        (model.owner === 'bytedance' && model.name === 'seededit-3.0')
    ) {
        payloadInput.image = input.image;
    } 
    // 3. Models that accept "image" as a list
    // - qwen/qwen-image-edit-plus
    else if (model.owner === 'qwen' && model.name === 'qwen-image-edit-plus') {
        payloadInput.image = [input.image];
    } 
    // 4. All others accept "image_input" as a list param
    // - google/nano-banana-pro
    // - google/nano-banana
    // - seedream-4
    else {
        payloadInput.image_input = [input.image];
    }
  }

  const targetUrl = `https://api.replicate.com/v1/models/${model.owner}/${model.name}/predictions`;
  // Prepend the proxy
  const url = `${PROXY_URL}${targetUrl}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ input: payloadInput }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      // Handle 404 specifically for incorrect model names
      if (response.status === 404) {
         throw new Error(`Model not found (${model.owner}/${model.name}). Check model ID.`);
      }
      if (response.status === 401) {
         throw new Error("Invalid API Key.");
      }
      if (response.status === 422) {
         throw new Error(`Invalid inputs for this model. (It might not support images or specific parameters)`);
      }
      throw new Error(`Replicate Error (${response.status}): ${errorBody}`);
    }

    const prediction = await response.json();
    return prediction;
  } catch (err: any) {
    // Catch network errors (like CORS if proxy fails)
    if (err.message === 'Failed to fetch') {
       throw new Error("Network error. The CORS proxy might be blocked or down.");
    }
    throw err;
  }
};

export const pollPrediction = async (apiKey: string, predictionUrl: string) => {
  const headers = {
    Authorization: `Token ${apiKey}`,
    'Content-Type': 'application/json',
  };

  // The predictionUrl returned by Replicate (urls.get) is a direct URL.
  // We must also proxy this polling request.
  const url = `${PROXY_URL}${predictionUrl}`;

  while (true) {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
        // If the polling fails (e.g. 429 rate limit), we might want to wait longer or throw
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