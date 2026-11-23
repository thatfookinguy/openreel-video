# MarketXyn Studio — What to test now

Branch: `feat/ai-generation-effects-auth`

```bash
git checkout feat/ai-generation-effects-auth
git pull
pnpm install
pnpm dev
```

## Good place to test? **Yes — for the core MarketXyn loop.**

You can validate product direction, UI, keys, and several real generation paths. It is **not** finished production software; expect rough edges and missing polish.

### Scorecard (honest)

| Area | Ready to test? | Notes |
|------|----------------|-------|
| App boots / editor | Yes | OpenReel base |
| AI Tools tab + MarketXyn cards | Yes | Hub provider mounted |
| API Keys save (guest) | Yes | localStorage |
| Affiliate research + script | Yes | Needs OpenRouter **or** Ollama |
| AI Image (FLUX) | Yes | Needs **fal.ai** key |
| Brand SVG logo | Yes | No API key |
| Website HTML export | Yes | No API key |
| Graphics / Personal | Yes | Needs fal key (uses image engine) |
| AI Video (Kling) | Partial | Needs fal + working provider code |
| AI Audio (ElevenLabs) | Partial | Needs key + provider |
| AI Effects on selected clip | Partial | Clip id not fully wired |
| Product / Character / Clipping | Not yet | Scaffold only |
| Cloud workers / credits | No | Browser BYOK only |

### 15-minute smoke test

1. **Boot** — `pnpm dev`, open project, open **AI Tools**. Confirm header **MarketXyn Studio**.
2. **Settings** — paste keys you have (OpenRouter and/or Ollama, fal, ElevenLabs) → Save. Reload → keys still there.
3. **Brand** — name + colors → Generate SVG → Download. No key needed.
4. **Website** — site name → Generate → Download `index.html` → open in browser.
5. **Affiliate** (OpenRouter or Ollama running) — product name → Research → Generate Script. Read hook/body/CTA.
6. **Image** (fal key) — short prompt → Generate → confirm preview + item in media library.
7. **Studio Hub** — Simple/Pro toggle; list of modules with live/scaffold badges.

### If something fails

- **useAIHub / missing package** — `pnpm install` from repo root on this branch.
- **fal / OpenRouter errors** — check key in Settings; network/CORS in browser console.
- **Ollama** — `ollama serve` + model pulled; base URL `http://127.0.0.1:11434`.
- **importMedia errors** — open a real project first (not empty welcome only).

### Worth testing before building more

If steps 1–5 work, the **product shell is real**. If image (6) works, generative pipeline to library is real. That is enough signal to keep building the rest.
