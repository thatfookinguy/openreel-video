/** Marketing / social graphics — canvas sizes + resize presets. */
export const PLATFORM_SIZES: Record<string, { w: number; h: number; label: string }> = {
  "ig-post": { w: 1080, h: 1080, label: "Instagram Post" },
  "ig-story": { w: 1080, h: 1920, label: "Instagram Story" },
  "tiktok": { w: 1080, h: 1920, label: "TikTok" },
  "yt-thumb": { w: 1280, h: 720, label: "YouTube Thumbnail" },
  "fb-post": { w: 1200, h: 630, label: "Facebook Post" },
  "linkedin": { w: 1200, h: 627, label: "LinkedIn" },
  "twitter": { w: 1600, h: 900, label: "X / Twitter" },
  "flyer-letter": { w: 2550, h: 3300, label: "Flyer Letter (300dpi)" },
};

export class GraphicsStudioEngine {
  listPresets() {
    return Object.entries(PLATFORM_SIZES).map(([id, v]) => ({ id, ...v }));
  }
}
