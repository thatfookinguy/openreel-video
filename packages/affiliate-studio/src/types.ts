export interface AffiliateProduct {
  name: string;
  url?: string;
  price?: string;
  niche?: string;
  benefits: string[];
  painPoints: string[];
  targetAudience: string;
  uniqueSellingPoints: string[];
}

export interface AffiliateScript {
  id: string;
  productName: string;
  style: "short-form" | "long-form" | "story" | "review" | "ugc";
  platform: "tiktok" | "youtube" | "instagram" | "facebook" | "general";
  hook: string;
  body: string;
  cta: string;
  fullScript: string;
  estimatedDurationSec: number;
  createdAt: number;
}

export interface AffiliateCampaign {
  id: string;
  name: string;
  product: AffiliateProduct;
  scripts: AffiliateScript[];
  status: "draft" | "ready" | "producing" | "done";
  createdAt: number;
}
