export type AudioMode = "music" | "tts" | "sfx" | "voice-clone";

export interface AudioGenerationRequest {
  id: string;
  mode: AudioMode;
  prompt: string;
  durationSec?: number;
  lyrics?: string;
  voiceId?: string;
  referenceAudio?: Blob;
  provider: "elevenlabs" | "stable-audio" | "lyria" | "local-comfy" | "kokoro";
  model?: string;
  seed?: number;
  instrumental?: boolean;
}

export interface AudioGenerationJob {
  id: string;
  request: AudioGenerationRequest;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  progress: number;
  resultBlob?: Blob;
  error?: string;
  createdAt: number;
}
