# Final Wiring – AI Hub is live

## What was completed

1. **AIHubProvider** (`apps/web/src/components/editor/ai/AIHubContext.tsx`)
   - Creates the AI Hub once
   - Connects `addMediaAsset` to the real `projectStore.importMedia`
   - Generated video/audio automatically appears in the media library

2. **AIGenTab** now receives real engines via `useAIHub()`
   - AI Video → `hub.video`
   - AI Audio → `hub.audio`
   - AI Effects → `hub.effects`
   - Settings → works with auth + key storage

## How to activate the provider

Wrap the editor (or the panel that contains `AIGenTab`) with the provider:

```tsx
import { AIHubProvider } from "./ai/AIHubContext";

// Somewhere above AIGenTab in the component tree:
<AIHubProvider>
  {/* existing editor layout that eventually renders <AIGenTab /> */}
</AIHubProvider>
```

Common places:
- Around the main EditorInterface
- Or around the right-side inspector that hosts the AI Tools tab

Once the provider is above `AIGenTab`, everything is fully connected.

## Flow

1. User opens **AI Tools** → **AI Video Generation**
2. Pastes keys in **API Keys & Settings** (fal.ai / ElevenLabs)
3. Types a prompt and clicks Generate
4. Provider runs → progress shows
5. On success the clip is imported via `projectStore.importMedia` → appears in the media library
6. User can drag it onto the timeline like any other media

Same flow for AI Audio.
