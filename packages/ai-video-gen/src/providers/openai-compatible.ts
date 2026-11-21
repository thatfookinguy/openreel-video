import { GenerationRequest } from "../types";

/**
 * Generic OpenAI-compatible video endpoint
 * Useful for Sora-style or other providers that follow the same pattern.
 */
export class OpenAICompatibleVideoProvider {
  constructor(
    private getConfig: () => { apiKey?: string; baseUrl?: string; model?: string }
  ) {}

  async generate(
    req: GenerationRequest,
    onProgress: (p: number) => void
  ): Promise<string | Blob> {
    const { apiKey, baseUrl, model } = this.getConfig();
    if (!apiKey || !baseUrl) {
      throw new Error("OpenAI-compatible API key or base URL missing in Settings");
    }

    onProgress(10);

    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/videos/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "sora",
        prompt: req.prompt,
        duration: req.durationSec || 5,
        aspect_ratio: req.aspectRatio || "16:9",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI-compatible video failed: ${text}`);
    }

    const data = await res.json();
    onProgress(100);

    // Different providers return different shapes
    const url =
      data?.data?.[0]?.url ||
      data?.video_url ||
      data?.url ||
      data?.output?.[0];

    if (!url) throw new Error("No video URL returned");
    return url;
  }
}
