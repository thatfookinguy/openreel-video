# How to wire the new AI packages into OpenReel

## 1. Workspace

Add the new packages to `pnpm-workspace.yaml` if they are not already covered by the existing `packages/*` pattern (they should be).

## 2. Create the AI Hub once in the editor

```ts
import { createAIHub } from "@openreel/ai-hub";

// Somewhere near the root of the editor (e.g. EditorApp or a context provider)
const aiHub = createAIHub({
  addMediaAsset: async (file, meta) => {
    // call your existing media store / import function
    return existingAddMedia(file, meta);
  },
  addClipToTimeline: (mediaId) => {
    // optional – drop the generated clip onto the timeline
  },
  getCurrentUserId: () => useAuthStore.getState().user?.id ?? null,
});
```

## 3. Show the panels

Import the panels we added:

```tsx
import { AIVideoPanel } from "@/components/editor/ai/AIVideoPanel";
import { AIAudioPanel } from "@/components/editor/ai/AIAudioPanel";
import { AIEffectsPanel } from "@/components/editor/ai/AIEffectsPanel";
import { AISettingsPanel } from "@/components/editor/ai/AISettingsPanel";
import { LoginScreen } from "@/components/editor/ai/LoginScreen";
```

Add them to the right-side inspector or as new toolbar tabs:

- **AI Video** → `<AIVideoPanel engine={aiHub.video} />`
- **AI Audio** → `<AIAudioPanel engine={aiHub.audio} />`
- **AI Effects** → `<AIEffectsPanel engine={aiHub.effects} selectedClipId={currentClipId} />`
- **AI Settings** → `<AISettingsPanel />`

## 4. Optional login gate

You can wrap the editor with a simple check:

```tsx
const { isAuthenticated } = useAuthStore();

if (!isAuthenticated) {
  return <LoginScreen onSuccess={() => {}} />;
}
```

Or keep the editor fully usable without login and only require login when the user opens the Settings / API Keys panel.

## 5. Agent tools

Register the tools from each package into the existing AI agent catalog so the chat can call them:

- `aiVideoTools` from `@openreel/ai-video-gen`
- `aiAudioTools` from `@openreel/ai-audio-gen`
- `aiEffectsTools` from `@openreel/ai-effects`

## Current status

- Structure + engines + UI panels + auth + settings are in place
- Provider implementations (actual API calls to Kling, ElevenLabs, etc.) are still stubs and need to be filled with real fetch logic using the keys from Settings
- Background removal already exists in core – the AI Effects package builds on top of it

Next concrete steps if you want it fully live:
1. Implement the real provider classes (fal, ElevenLabs, etc.) using the keys from `getApiKeys()`
2. Hook `addMediaAsset` / timeline actions to the real OpenReel stores
3. Add the four panels to the existing editor toolbar / inspector
