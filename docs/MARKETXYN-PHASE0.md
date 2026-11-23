# MarketXyn Studio — Phase 0 (live on this branch)

Branch: `feat/ai-generation-effects-auth`

## What works now

1. **AI Tools tab** includes:
   - Affiliate Studio
   - AI Video Generation
   - AI Audio Generation
   - AI Effects
   - API Keys & Settings

2. **AIHubProvider** is applied inside `AIGenTab` so engines always exist when you open AI Tools.

3. **Guest user** is auto-created so you can save API keys without a login screen.

4. **Generated media** is routed through `projectStore.importMedia` → media library.

## Run

```bash
git checkout feat/ai-generation-effects-auth
pnpm install
pnpm dev
```

## First run

1. Open a project in the editor
2. Open **AI Tools**
3. **API Keys & Settings** → paste OpenRouter and/or Ollama, fal.ai, ElevenLabs → Save
4. **Affiliate Studio** → product name → Research → Generate Script
5. Copy script into **AI Audio** or use **AI Video** with a prompt

## Next (Phase 0.5)

- Harden fal / ElevenLabs providers against real API responses
- Pass selected timeline clip into AI Effects
- One-button Affiliate → voice → video pipeline in the UI
