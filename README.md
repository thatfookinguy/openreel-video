# MarketXyn Studio

> **Create. Convert. Scale.**  
> AI-powered creative studio for affiliate marketers and operators.  
> Research products → generate scripts → produce video & voice → export.  
> Privacy-first. Multi-API. Local or cloud.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-green) ![AI](https://img.shields.io/badge/AI-Multi%20Provider-purple)

---

## What is MarketXyn Studio?

MarketXyn Studio is a complete content production system built on top of a professional browser-based video editor. It is designed for people who make money from content — especially affiliate marketers — and need speed without sacrificing quality or privacy.

**Core loop:**

1. **Research** any product (OpenRouter or local Ollama)
2. **Generate** high-converting scripts for TikTok, YouTube, Instagram, Facebook
3. **Produce** voiceovers (ElevenLabs) and video (Kling / fal.ai / local)
4. **Edit** on a full multi-track timeline with AI effects
5. **Export** vertical or horizontal, ready to post

Everything stays on your device unless you choose a cloud provider. Your API keys are stored locally and encrypted per account.

---

## Key Features

### Affiliate Studio
- Product research (benefits, pain points, audience, USPs)
- Script generator (short-form, UGC, review, story)
- Ad creative angles
- Campaign organization

### Generative AI
- **Video** — text-to-video & image-to-video (fal.ai Kling + OpenAI-compatible + local ComfyUI)
- **Audio** — music, TTS, sound effects (ElevenLabs)
- **Effects** — background removal, subject isolation, object removal, face enhance, upscale
- **LLMs** — OpenRouter (hundreds of models) + Ollama (fully local)

### Professional Editor
- Multi-track timeline, keyframes, color grading, audio mixing
- Auto captions, templates, filter presets
- 4K export, GPU accelerated (WebGPU / WebCodecs)
- 100% client-side media processing

### Account & Privacy
- Simple username / password accounts
- Encrypted local API key storage
- Project persistence per user
- No forced cloud uploads

---

## Quick Start

```bash
git clone https://github.com/thatfookinguy/openreel-video.git
cd openreel-video
git checkout feat/ai-generation-effects-auth
pnpm install
pnpm dev
```

1. Open the app
2. Go to **AI Tools → API Keys & Settings**
3. Add OpenRouter (or Ollama), fal.ai, and ElevenLabs keys
4. Open **Affiliate Studio** → research a product → generate a script
5. Send to **AI Audio** / **AI Video** → drop into timeline → export

---

## Providers

| Provider | Use for | Key location |
|----------|---------|--------------|
| OpenRouter | Research, scripts, creatives | Settings → openrouter |
| Ollama | Local LLM (free, private) | Settings → ollama baseUrl |
| fal.ai | Kling video generation | Settings → fal |
| ElevenLabs | Voice, music, SFX | Settings → elevenlabs |
| OpenAI-compatible | Alternative video endpoints | Settings → openai |

---

## Architecture (new packages)

```
packages/
  ai-video-gen/       # Video generation engine + providers
  ai-audio-gen/       # Audio generation engine + ElevenLabs
  ai-effects/         # Background removal, isolation, enhance…
  ai-llm/             # Ollama + OpenRouter
  affiliate-studio/   # Product research + scripts + campaigns
  auth-and-storage/   # Login, keys, project persistence
  ai-hub/             # Single entry point wiring everything
```

---

## License & Attribution

MarketXyn Studio is distributed under the **MIT License**.

The core video editing engine is derived from **[OpenReel Video](https://github.com/Augani/openreel-video)** (MIT).  
All original copyright notices are retained. See `LICENSE`.

New packages and product features (AI generation, Affiliate Studio, auth, multi-API layer) are part of the MarketXyn Studio product layer.

---

## Tagline

**Create. Convert. Scale.**
