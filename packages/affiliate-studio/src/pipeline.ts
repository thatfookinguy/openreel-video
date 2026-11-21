/**
 * One-click Affiliate Pipeline
 * Research → Script → (optional) TTS + Video generation hooks
 */
import type { AffiliateStudioEngine } from "./engine";
import type { AffiliateProduct, AffiliateScript } from "./types";

export interface PipelineResult {
  product: AffiliateProduct;
  script: AffiliateScript;
  voiceJobId?: string;
  videoJobId?: string;
}

export interface PipelineOptions {
  productName: string;
  extra?: string;
  style?: AffiliateScript["style"];
  platform?: AffiliateScript["platform"];
  provider?: "openrouter" | "ollama";
  /** Optional: generate TTS from the script */
  generateVoice?: (text: string) => Promise<string>;
  /** Optional: generate video from a visual prompt derived from the script */
  generateVideo?: (prompt: string) => Promise<string>;
}

export async function runAffiliatePipeline(
  engine: AffiliateStudioEngine,
  opts: PipelineOptions
): Promise<PipelineResult> {
  const product = await engine.researchProduct(
    opts.productName,
    opts.extra,
    opts.provider || "openrouter"
  );

  const script = await engine.generateScript(
    product,
    opts.style || "short-form",
    opts.platform || "tiktok",
    opts.provider || "openrouter"
  );

  const campaign = engine.createCampaign(`${product.name} — ${opts.platform || "tiktok"}`, product);
  engine.addScriptToCampaign(campaign.id, script);

  let voiceJobId: string | undefined;
  let videoJobId: string | undefined;

  if (opts.generateVoice) {
    voiceJobId = await opts.generateVoice(script.fullScript);
  }

  if (opts.generateVideo) {
    const visualPrompt = `Cinematic product footage for ${product.name}. ${product.uniqueSellingPoints?.[0] || ""}. Vertical 9:16, clean modern look.`;
    videoJobId = await opts.generateVideo(visualPrompt);
  }

  return { product, script, voiceJobId, videoJobId };
}
