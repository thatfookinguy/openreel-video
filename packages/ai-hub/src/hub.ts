import { AIVideoGenerationEngine } from "@openreel/ai-video-gen";
import { AIAudioGenerationEngine } from "@openreel/ai-audio-gen";
import { AIEffectsEngine } from "@openreel/ai-effects";
import { LLMEngine } from "@openreel/ai-llm";
import { AffiliateStudioEngine } from "@openreel/affiliate-studio";
import { ImageStudioEngine } from "@openreel/image-studio";
import { BrandStudioEngine } from "@openreel/brand-studio";
import { QCEngine } from "@openreel/qc-service";
import { ModelRouter } from "@openreel/model-router";
import { WebsiteStudioEngine } from "@openreel/website-studio";
import { MediaBridge as VideoMediaBridge } from "@openreel/ai-video-gen";
import { useAuthStore, loadApiKeys } from "@openreel/auth-and-storage";

export interface AIHubOptions {
  addMediaAsset: (file: File | Blob, meta: any) => Promise<string>;
  addClipToTimeline?: (mediaId: string, trackIndex?: number) => void;
  getCurrentUserId?: () => string | null;
}

export interface AIHub {
  video: AIVideoGenerationEngine;
  audio: AIAudioGenerationEngine;
  effects: AIEffectsEngine;
  llm: LLMEngine;
  affiliate: AffiliateStudioEngine;
  image: ImageStudioEngine;
  brand: BrandStudioEngine;
  website: WebsiteStudioEngine;
  qc: QCEngine;
  models: ModelRouter;
  getApiKeys: () => Record<string, any>;
  isAuthenticated: () => boolean;
  addMediaAsset: (file: File | Blob, meta?: any) => Promise<string>;
}

export function createAIHub(options: AIHubOptions): AIHub {
  const getUserId = () =>
    options.getCurrentUserId?.() || useAuthStore.getState().user?.id || "guest";

  const getApiKeys = () => {
    const userId = getUserId();
    return loadApiKeys(userId || "guest");
  };

  const videoBridge = new VideoMediaBridge(
    options.addMediaAsset,
    options.addClipToTimeline
  );

  const video = new AIVideoGenerationEngine(videoBridge, getApiKeys);
  const audio = new AIAudioGenerationEngine(getApiKeys, async (blob, meta) => {
    await options.addMediaAsset(blob, { source: "ai-audio", ...meta });
  });
  const effects = new AIEffectsEngine();
  const llm = new LLMEngine(getApiKeys);
  const affiliate = new AffiliateStudioEngine(llm);
  const image = new ImageStudioEngine(getApiKeys);
  const brand = new BrandStudioEngine();
  const website = new WebsiteStudioEngine();
  const qc = new QCEngine();
  const models = new ModelRouter(getApiKeys);

  return {
    video,
    audio,
    effects,
    llm,
    affiliate,
    image,
    brand,
    website,
    qc,
    models,
    getApiKeys,
    isAuthenticated: () => !!getUserId(),
    addMediaAsset: options.addMediaAsset,
  };
}
