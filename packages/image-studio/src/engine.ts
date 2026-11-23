/**
 * AI Image Studio engine
 * Routes through model-router → fal / ComfyUI / OpenAI-compatible.
 */
export type ImageMode =
  | "text-to-image"
  | "image-to-image"
  | "inpaint"
  | "outpaint"
  | "upscale"
  | "remove-bg"
  | "variations";

export interface ImageJobRequest {
  mode: ImageMode;
  prompt: string;
  negativePrompt?: string;
  referenceImageUrl?: string;
  maskUrl?: string;
  width?: number;
  height?: number;
  provider?: string;
}

export interface ImageJob {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  progress: number;
  request: ImageJobRequest;
  resultUrl?: string;
  resultBlob?: Blob;
  error?: string;
}

export class ImageStudioEngine {
  private jobs = new Map<string, ImageJob>();
  private listeners = new Set<(jobs: ImageJob[]) => void>();

  constructor(private getApiKeys: () => Record<string, any> = () => ({})) {}

  getJobs() {
    return Array.from(this.jobs.values()).sort((a, b) => (a.id < b.id ? 1 : -1));
  }

  subscribe(fn: (jobs: ImageJob[]) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.getJobs()));
  }

  async generate(req: ImageJobRequest): Promise<ImageJob> {
    const id = crypto.randomUUID();
    const job: ImageJob = {
      id,
      status: "running",
      progress: 5,
      request: req,
    };
    this.jobs.set(id, job);
    this.emit();

    try {
      const keys = this.getApiKeys();
      const falKey = keys.fal?.apiKey;

      if (req.mode === "text-to-image" && falKey) {
        // fal flux / sd endpoint (queue style)
        const res = await fetch("https://queue.fal.run/fal-ai/flux/dev", {
          method: "POST",
          headers: {
            Authorization: `Key ${falKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: req.prompt,
            image_size: {
              width: req.width || 1024,
              height: req.height || 1024,
            },
            num_images: 1,
          }),
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(`fal image error: ${t}`);
        }

        const data = await res.json();
        // Immediate or request_id — handle both shapes
        if (data.images?.[0]?.url) {
          job.resultUrl = data.images[0].url;
          job.status = "succeeded";
          job.progress = 100;
        } else if (data.request_id) {
          job.status = "running";
          job.progress = 20;
          // Poll
          const url = await this.pollFal(falKey, data.request_id);
          job.resultUrl = url;
          job.status = "succeeded";
          job.progress = 100;
        } else {
          throw new Error("Unexpected fal response");
        }
      } else if (!falKey) {
        throw new Error("Add a fal.ai API key in Settings for image generation (or configure ComfyUI later).");
      } else {
        throw new Error(`Mode ${req.mode} — wire remaining endpoints next`);
      }
    } catch (e: any) {
      job.status = "failed";
      job.error = e.message || String(e);
    }

    this.jobs.set(id, job);
    this.emit();
    return job;
  }

  private async pollFal(apiKey: string, requestId: string): Promise<string> {
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const res = await fetch(`https://queue.fal.run/fal-ai/flux/dev/requests/${requestId}`, {
        headers: { Authorization: `Key ${apiKey}` },
      });
      const data = await res.json();
      if (data.status === "COMPLETED" && data.images?.[0]?.url) {
        return data.images[0].url;
      }
      if (data.images?.[0]?.url) return data.images[0].url;
      if (data.status === "FAILED") throw new Error("fal job failed");
    }
    throw new Error("fal image timed out");
  }
}
