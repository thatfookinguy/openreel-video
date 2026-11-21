import { GenerationRequest } from "../types";

/**
 * fal.ai Kling provider
 * Docs: https://fal.ai/models/fal-ai/kling-video
 */
export class FalKlingProvider {
  constructor(private getApiKey: () => string | undefined) {}

  async generate(
    req: GenerationRequest,
    onProgress: (p: number) => void
  ): Promise<string | Blob> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("fal.ai API key missing. Add it in AI Settings.");

    onProgress(5);

    const isImageToVideo = req.mode === "image-to-video" && req.imageFile;

    // 1. Upload image if needed
    let imageUrl: string | undefined;
    if (isImageToVideo && req.imageFile) {
      onProgress(10);
      imageUrl = await this.uploadFile(req.imageFile, apiKey);
    }

    // 2. Choose endpoint
    const endpoint = isImageToVideo
      ? "https://queue.fal.run/fal-ai/kling-video/v1.6/standard/image-to-video"
      : "https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video";

    const body: any = {
      prompt: req.prompt,
      duration: String(req.durationSec || 5),
      aspect_ratio: req.aspectRatio || "16:9",
    };

    if (imageUrl) {
      body.image_url = imageUrl;
    }

    if (req.negativePrompt) {
      body.negative_prompt = req.negativePrompt;
    }

    // 3. Create job
    onProgress(15);
    const createRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!createRes.ok) {
      const text = await createRes.text();
      throw new Error(`fal.ai create failed: ${text}`);
    }

    const { request_id } = await createRes.json();
    if (!request_id) throw new Error("No request_id returned from fal.ai");

    // 4. Poll until complete
    for (let i = 0; i < 120; i++) {
      await sleep(3000);
      onProgress(Math.min(90, 20 + i * 1.5));

      const statusRes = await fetch(
        `https://queue.fal.run/fal-ai/kling-video/requests/${request_id}/status`,
        {
          headers: { Authorization: `Key ${apiKey}` },
        }
      );

      if (!statusRes.ok) continue;

      const status = await statusRes.json();

      if (status.status === "COMPLETED") {
        const resultRes = await fetch(
          `https://queue.fal.run/fal-ai/kling-video/requests/${request_id}`,
          {
            headers: { Authorization: `Key ${apiKey}` },
          }
        );
        const data = await resultRes.json();
        const videoUrl = data?.video?.url || data?.video_url;
        if (!videoUrl) throw new Error("No video URL in fal.ai response");
        onProgress(100);
        return videoUrl;
      }

      if (status.status === "FAILED") {
        throw new Error(status.error || "Generation failed on fal.ai");
      }
    }

    throw new Error("Timed out waiting for fal.ai job");
  }

  private async uploadFile(file: Blob, apiKey: string): Promise<string> {
    // fal.ai supports direct URL or base64 in some models.
    // For simplicity we convert to base64 data URL for smaller images.
    // For production you should use fal's upload endpoint.
    const buffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const mime = file.type || "image/jpeg";
    return `data:${mime};base64,${base64}`;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
