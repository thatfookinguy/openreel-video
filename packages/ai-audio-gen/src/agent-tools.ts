export const aiAudioTools = [
  {
    name: "generate_music",
    description: "Generate background music or full song from text prompt. Auto-imports when ready.",
    parameters: {
      type: "object",
      properties: {
        prompt: { type: "string" },
        durationSec: { type: "number" },
        instrumental: { type: "boolean" },
        provider: { type: "string" },
      },
      required: ["prompt"],
    },
  },
  {
    name: "generate_voiceover",
    description: "Generate TTS or cloned voiceover. Supports ElevenLabs and local Kokoro.",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
        voiceId: { type: "string" },
        provider: { type: "string" },
      },
      required: ["text"],
    },
  },
  {
    name: "generate_sfx",
    description: "Generate sound effect from description.",
    parameters: {
      type: "object",
      properties: {
        prompt: { type: "string" },
        durationSec: { type: "number" },
      },
      required: ["prompt"],
    },
  },
];
