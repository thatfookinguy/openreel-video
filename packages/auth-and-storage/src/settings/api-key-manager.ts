export const PROVIDERS = [
  { id: "elevenlabs", name: "ElevenLabs (Music + Voice + SFX)", fields: ["apiKey"] },
  { id: "stable-audio", name: "Stable Audio / Stability AI", fields: ["apiKey"] },
  { id: "lyria", name: "Google Lyria (Gemini)", fields: ["apiKey"] },
  { id: "fal", name: "fal.ai (Kling / other)", fields: ["apiKey"] },
  { id: "openai", name: "OpenAI Compatible", fields: ["apiKey", "baseUrl"] },
  { id: "local-comfy", name: "Local ComfyUI", fields: ["baseUrl"] },
];

export function saveApiKeys(userId: string, keys: Record<string, any>) {
  // In production: encrypt with user-derived key
  localStorage.setItem(`api_keys_${userId}`, JSON.stringify(keys));
}

export function loadApiKeys(userId: string): Record<string, any> {
  const raw = localStorage.getItem(`api_keys_${userId}`);
  return raw ? JSON.parse(raw) : {};
}
