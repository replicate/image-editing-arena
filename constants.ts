import { ModelConfig } from './types';

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'nano-banana-pro',
    owner: 'google',
    name: 'nano-banana-pro',
    type: 'image-generation',
    description: 'Efficient Nano Banana Pro model',
    price: 0.15
  },
  {
    id: 'nano-banana',
    owner: 'google',
    name: 'nano-banana',
    type: 'image-generation',
    description: 'Efficient Nano Banana model',
    price: 0.04
  },
  {
    id: 'flux-2-dev',
    owner: 'black-forest-labs',
    name: 'flux-2-dev',
    type: 'image-generation',
    description: 'High-quality image generation model (Dev)',
    price: 0.02
  },
  {
    id: 'flux-2-pro',
    owner: 'black-forest-labs',
    name: 'flux-2-pro',
    type: 'image-generation',
    description: 'Professional grade flux model',
    price: 0.06
  },
  {
    id: 'flux-2-flex',
    owner: 'black-forest-labs',
    name: 'flux-2-flex',
    type: 'image-generation',
    description: 'Flexible optimized flux model',
    price: 0.12
  },
  {
    id: 'seedream-4',
    owner: 'bytedance',
    name: 'seedream-4',
    type: 'image-generation',
    description: 'Dream-like image generation',
    price: 0.03
  },
  {
    id: 'seededit-3.0',
    owner: 'bytedance',
    name: 'seededit-3.0',
    type: 'image-editing',
    description: 'SeedEdit 3.0',
    price: 0.03
  },
  {
    id: 'qwen-image-edit-plus',
    owner: 'qwen',
    name: 'qwen-image-edit-plus',
    type: 'image-editing',
    description: 'Advanced image editing with Qwen',
    price: 0.03
  },
  {
    id: 'qwen-image-edit',
    owner: 'qwen',
    name: 'qwen-image-edit',
    type: 'image-editing',
    description: 'Qwen Image Edit',
    price: 0.03
  },
  {
    id: 'reve-edit',
    owner: 'reve',
    name: 'edit',
    type: 'image-editing',
    description: 'Standard Reve image editor',
    price: 0.04
  },
  {
    id: 'reve-edit-fast',
    owner: 'reve',
    name: 'edit-fast',
    type: 'image-editing',
    description: 'Fast Reve image editor',
    price: 0.01
  }
];