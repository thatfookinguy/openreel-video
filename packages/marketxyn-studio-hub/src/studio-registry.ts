import type { StudioModule } from "./types";

export const STUDIO_REGISTRY: StudioModule[] = [
  { id: "video", name: "Video Production Studio", description: "Timeline, AI video, audio, captions, export", phase: 0, status: "live" },
  { id: "affiliate", name: "Affiliate Studio", description: "Product research, scripts, ad creatives, pipeline", phase: 0, status: "live" },
  { id: "settings", name: "API Keys & Settings", description: "Providers, Ollama, OpenRouter, fal, ElevenLabs", phase: 0, status: "live" },
  { id: "image", name: "AI Image Studio", description: "Text-to-image, import to library", phase: 1, status: "live" },
  { id: "brand", name: "Logo & Branding Studio", description: "SVG logos, brand kits, colors", phase: 2, status: "live" },
  { id: "graphics", name: "Graphic Design & Marketing", description: "Social sizes, ads, thumbnails", phase: 2, status: "live" },
  { id: "personal", name: "Personal Design Studio", description: "Invites, holiday, printables", phase: 2, status: "live" },
  { id: "product", name: "Product Rendering Studio", description: "Mockups, ecommerce product shots", phase: 3, status: "live" },
  { id: "character", name: "Character & Artwork Studio", description: "Characters, poses, reference sheets", phase: 3, status: "live" },
  { id: "website", name: "Website & Web Design Studio", description: "Real HTML sites, download", phase: 3, status: "live" },
  { id: "clipping", name: "Clipping & Long-form", description: "Highlights, vertical reframes", phase: 4, status: "scaffold" },
];
