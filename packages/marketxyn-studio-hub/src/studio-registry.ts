import type { StudioModule } from "./types";

/** Full MarketXyn module map — everything is on the roadmap and registered. */
export const STUDIO_REGISTRY: StudioModule[] = [
  {
    id: "video",
    name: "Video Production Studio",
    description: "Timeline, AI video, audio, captions, export",
    phase: 0,
    status: "live",
  },
  {
    id: "affiliate",
    name: "Affiliate Studio",
    description: "Product research, scripts, ad creatives, pipeline",
    phase: 0,
    status: "live",
  },
  {
    id: "settings",
    name: "API Keys & Settings",
    description: "Providers, Ollama, OpenRouter, fal, ElevenLabs",
    phase: 0,
    status: "live",
  },
  {
    id: "image",
    name: "AI Image Studio",
    description: "Text-to-image, inpaint, outpaint, upscale, variations",
    phase: 1,
    status: "scaffold",
  },
  {
    id: "brand",
    name: "Logo & Branding Studio",
    description: "Logos (SVG), brand kits, typography, colors",
    phase: 2,
    status: "scaffold",
  },
  {
    id: "graphics",
    name: "Graphic Design & Marketing",
    description: "Flyers, social posts, thumbnails, resize for platforms",
    phase: 2,
    status: "scaffold",
  },
  {
    id: "personal",
    name: "Personal Design Studio",
    description: "Invites, holiday cards, printables, merch",
    phase: 2,
    status: "scaffold",
  },
  {
    id: "product",
    name: "Product Rendering Studio",
    description: "Mockups, packaging, ecommerce product shots",
    phase: 3,
    status: "scaffold",
  },
  {
    id: "character",
    name: "Character & Artwork Studio",
    description: "Characters, reference sheets, consistency",
    phase: 3,
    status: "scaffold",
  },
  {
    id: "website",
    name: "Website & Web Design Studio",
    description: "Real HTML/CSS/JS sites, landing pages, deploy",
    phase: 3,
    status: "scaffold",
  },
  {
    id: "clipping",
    name: "Clipping & Long-form",
    description: "Highlights, vertical reframes, repurposing",
    phase: 4,
    status: "scaffold",
  },
];
