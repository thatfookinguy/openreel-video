# OpenReel AI Extensions

This branch adds four new packages that turn OpenReel into a full AI creative suite while staying privacy-first and multi-API.

## Packages

### `@openreel/ai-video-gen`
- Text-to-video / Image-to-video / Video-to-video
- Multi-provider (fal Kling, Runway, Luma, OpenAI-compatible, Local ComfyUI)
- Auto-import into media library + timeline
- Agent tools for the AI chat

### `@openreel/ai-audio-gen`
- Music generation
- TTS / Voice cloning
- Sound effects
- Providers: ElevenLabs, Stable Audio, Lyria, Local models

### `@openreel/auth-and-storage`
- Simple username + password auth
- Email-only password reset
- Encrypted local storage of API keys per user
- Project persistence per user (IndexedDB)

### `@openreel/ai-effects`
- Improved Background Removal (builds on existing engine)
- Object Removal / Inpainting
- Subject Isolation (cut subject to new track)
- Face Enhancement
- Style Transfer
- Upscale
- Full set of agent tools so the AI chat can call any of these

## How to use

1. Checkout the branch `feat/ai-generation-effects-auth`
2. The packages are ready to be wired into the monorepo workspace
3. Settings tab → paste your own API keys (ElevenLabs, fal, etc.)
4. AI Video / AI Audio / AI Effects panels appear in the editor
5. The existing AI agent can now call `generate_video`, `generate_music`, `remove_background`, `isolate_subject`, etc.

All keys stay local and encrypted. No forced cloud uploads.
