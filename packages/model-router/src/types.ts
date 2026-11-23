export type ModelCapability =
  | "llm"
  | "image-gen"
  | "image-edit"
  | "video-gen"
  | "tts"
  | "music"
  | "sfx"
  | "stt"
  | "vision"
  | "upscale"
  | "matting";

export interface ModelProvider {
  id: string;
  name: string;
  capabilities: ModelCapability[];
  local: boolean;
  requiresKey: boolean;
  costTier: "free" | "low" | "medium" | "high";
}

export const KNOWN_PROVIDERS: ModelProvider[] = [
  { id: "ollama", name: "Ollama", capabilities: ["llm", "vision"], local: true, requiresKey: false, costTier: "free" },
  { id: "openrouter", name: "OpenRouter", capabilities: ["llm", "vision"], local: false, requiresKey: true, costTier: "low" },
  { id: "fal", name: "fal.ai", capabilities: ["video-gen", "image-gen", "image-edit", "upscale"], local: false, requiresKey: true, costTier: "medium" },
  { id: "elevenlabs", name: "ElevenLabs", capabilities: ["tts", "music", "sfx"], local: false, requiresKey: true, costTier: "medium" },
  { id: "comfyui", name: "ComfyUI", capabilities: ["image-gen", "image-edit", "upscale"], local: true, requiresKey: false, costTier: "free" },
  { id: "openai-compatible", name: "OpenAI Compatible", capabilities: ["llm", "image-gen", "video-gen"], local: false, requiresKey: true, costTier: "medium" },
];
