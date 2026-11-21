import type { AffiliateProduct, AffiliateScript, AffiliateCampaign } from "./types";
import { productResearchPrompt, scriptPrompt, adCreativePrompt } from "./prompts";
import type { LLMEngine } from "@openreel/ai-llm";

export class AffiliateStudioEngine {
  private campaigns = new Map<string, AffiliateCampaign>();
  private listeners = new Set<(campaigns: AffiliateCampaign[]) => void>();

  constructor(private llm: LLMEngine) {}

  async researchProduct(
    productName: string,
    extra?: string,
    provider: "ollama" | "openrouter" = "openrouter"
  ): Promise<AffiliateProduct> {
    const res = await this.llm.chat(
      {
        messages: [{ role: "user", content: productResearchPrompt(productName, extra) }],
        temperature: 0.4,
      },
      provider
    );

    try {
      return JSON.parse(res.content) as AffiliateProduct;
    } catch {
      // Fallback if model returns markdown
      const match = res.content.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error("Failed to parse product research JSON");
    }
  }

  async generateScript(
    product: AffiliateProduct,
    style: AffiliateScript["style"] = "short-form",
    platform: AffiliateScript["platform"] = "tiktok",
    provider: "ollama" | "openrouter" = "openrouter"
  ): Promise<AffiliateScript> {
    const res = await this.llm.chat(
      {
        messages: [
          {
            role: "user",
            content: scriptPrompt(product, style, platform, "short"),
          },
        ],
        temperature: 0.75,
      },
      provider
    );

    let parsed: any;
    try {
      parsed = JSON.parse(res.content);
    } catch {
      const match = res.content.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Failed to parse script JSON");
    }

    return {
      id: crypto.randomUUID(),
      productName: product.name,
      style,
      platform,
      hook: parsed.hook || "",
      body: parsed.body || "",
      cta: parsed.cta || "",
      fullScript: parsed.fullScript || `${parsed.hook}\n\n${parsed.body}\n\n${parsed.cta}`,
      estimatedDurationSec: parsed.estimatedDurationSec || 30,
      createdAt: Date.now(),
    };
  }

  async generateAdCreatives(
    product: AffiliateProduct,
    platform: string = "tiktok",
    provider: "ollama" | "openrouter" = "openrouter"
  ) {
    const res = await this.llm.chat(
      {
        messages: [{ role: "user", content: adCreativePrompt(product, platform) }],
        temperature: 0.8,
      },
      provider
    );

    try {
      return JSON.parse(res.content);
    } catch {
      const match = res.content.match(/\[[\s\S]*\]/);
      if (match) return JSON.parse(match[0]);
      return [{ raw: res.content }];
    }
  }

  createCampaign(name: string, product: AffiliateProduct): AffiliateCampaign {
    const campaign: AffiliateCampaign = {
      id: crypto.randomUUID(),
      name,
      product,
      scripts: [],
      status: "draft",
      createdAt: Date.now(),
    };
    this.campaigns.set(campaign.id, campaign);
    this.emit();
    return campaign;
  }

  addScriptToCampaign(campaignId: string, script: AffiliateScript) {
    const c = this.campaigns.get(campaignId);
    if (!c) return;
    c.scripts.push(script);
    c.status = "ready";
    this.emit();
  }

  getCampaigns() {
    return Array.from(this.campaigns.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }

  subscribe(fn: (campaigns: AffiliateCampaign[]) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.getCampaigns()));
  }
}
