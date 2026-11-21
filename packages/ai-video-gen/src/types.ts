export type GenerationMode = "text-to-video" | "image-to-video" | "video-to-video";

export interface GenerationRequest {
  id: string;
  mode: GenerationMode;
  prompt: string;
  negativePrompt?: string;
  imageFile?: File | Blob;
  videoFile?: File | Blob;
  durationSec?: number;
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:3";
  resolution?: "720p" | "1080p" | "4k";
  seed?: number;
  provider: string;
  model?: string;
  strength?: number;
  motionBucketId?: number;
}

export interface GenerationJob {
  id: string;
  request: GenerationRequest;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  progress: number;
  resultUrl?: string;
  resultBlob?: Blob;
  error?: string;
  createdAt: number;
  updatedAt: number;
  providerJobId?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  enabled: boolean;
  supports: GenerationMode[];
  maxDuration: number;
  requiresKey: boolean;
}
