import { AIVideoGenerationEngine } from "@openreel/ai-video-gen";
import { AIAudioGenerationEngine } from "@openreel/ai-audio-gen";
import { AIEffectsEngine } from "@openreel/ai-effects";
import { MediaBridge as VideoMediaBridge } from "@openreel/ai-video-gen";
import { useAuthStore } from "@openreel/auth-and-storage";
import { loadApiKeys } from "@openreel/auth-and-storage";

export interface AIHubOptions {
  addMediaAsset: (file: File | Blob, meta: any) => Promise<string>;
  addClipToTimeline?: (mediaId: string, trackIndex?: number) => void;
  getCurrentUserId?: () => string | null;
}

export interface AIHub {
  video: AIVideoGenerationEngine;
  audio: AIAudioGenerationEngine;
  effects: AIEffectsEngine;
  getApiKeys: () => Record<string, any>;
  isAuthenticated: () => boolean;
}

export function createAIHub(options: AIHubOptions): AIHub {
  const getUserId = () =>
    options.getCurrentUserId?.() || useAuthStore.getState().user?.id || null;

  const getApiKeys = () => {
    const userId = getUserId();
    if (!userId) return {};
    return loadApiKeys(userId);
  };

  const videoBridge = new VideoMediaBridge(
    options.addMediaAsset,
    options.addClipToTimeline
  );

  const video = new AIVideoGenerationEngine(videoBridge, getApiKeys);

  const audio = new AIAudioGenerationEngine(getApiKeys, async (blob, meta) => {
    await options.addMediaAsset(blob, {
      source: "ai-audio",
      ...meta,
    });
  });

  const effects = new AIEffectsEngine();

  return {
    video,
    audio,
    effects,
    getApiKeys,
    isAuthenticated: () => !!getUserId(),
  };
}
