export type EffectType =
  | "background-removal"
  | "object-removal"
  | "subject-isolation"
  | "face-enhance"
  | "style-transfer"
  | "upscale";

export interface EffectRequest {
  id: string;
  type: EffectType;
  clipId: string;
  settings: Record<string, any>;
  provider?: "local" | "elevenlabs" | "fal" | "replicate" | "custom";
}

export interface EffectJob {
  id: string;
  request: EffectRequest;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  progress: number;
  resultClipId?: string;
  error?: string;
  createdAt: number;
}
