import { GenerationRequest, GenerationJob } from "./types";
import { MediaBridge } from "./media-bridge";
import { FalKlingProvider } from "./providers/fal-kling";
import { OpenAICompatibleVideoProvider } from "./providers/openai-compatible";
import { LocalComfyProvider } from "./providers/local-comfy";

export class AIVideoGenerationEngine {
  private jobs = new Map<string, GenerationJob>();
  private listeners = new Set<(jobs: GenerationJob[]) => void>();
  private mediaBridge: MediaBridge;
  private getApiKeys: () => Record<string, any>;

  constructor(
    mediaBridge: MediaBridge,
    getApiKeys: () => Record<string, any> = () => ({})
  ) {
    this.mediaBridge = mediaBridge;
    this.getApiKeys = getApiKeys;
  }

  private getProvider(name: string) {
    const keys = this.getApiKeys();

    switch (name) {
      case "fal-kling":
        return new FalKlingProvider(() => keys.fal?.apiKey || keys["fal-kling"]?.apiKey);
      case "openai-compatible":
        return new OpenAICompatibleVideoProvider(() => ({
          apiKey: keys.openai?.apiKey,
          baseUrl: keys.openai?.baseUrl,
          model: keys.openai?.model,
        }));
      case "local-comfy":
        return new LocalComfyProvider(() => keys["local-comfy"]?.baseUrl);
      default:
        throw new Error(`Unknown video provider: ${name}`);
    }
  }

  async generate(req: Omit<GenerationRequest, "id">): Promise<string> {
    const id = crypto.randomUUID();
    const job: GenerationJob = {
      id,
      request: { ...req, id },
      status: "queued",
      progress: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.jobs.set(id, job);
    this.emit();
    this.runJob(id).catch(() => {});
    return id;
  }

  private async runJob(id: string) {
    const job = this.jobs.get(id);
    if (!job) return;

    try {
      this.update(id, { status: "running", progress: 5 });

      const provider = this.getProvider(job.request.provider);
      const result = await provider.generate(job.request, (progress: number) => {
        this.update(id, { progress });
      });

      let blob: Blob;
      if (result instanceof Blob) {
        blob = result;
      } else {
        const res = await fetch(result);
        blob = await res.blob();
      }

      this.update(id, {
        status: "succeeded",
        progress: 100,
        resultBlob: blob,
      });

      await this.mediaBridge.importGeneratedClip(blob, {
        name: `AI_${job.request.mode}_${Date.now()}.mp4`,
        prompt: job.request.prompt,
        provider: job.request.provider,
      });
    } catch (err: any) {
      this.update(id, {
        status: "failed",
        error: err?.message || String(err),
        progress: 0,
      });
    }
  }

  private update(id: string, patch: Partial<GenerationJob>) {
    const job = this.jobs.get(id);
    if (!job) return;
    Object.assign(job, patch, { updatedAt: Date.now() });
    this.emit();
  }

  cancel(id: string) {
    const job = this.jobs.get(id);
    if (job && (job.status === "queued" || job.status === "running")) {
      this.update(id, { status: "cancelled" });
    }
  }

  getJobs(): GenerationJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  subscribe(fn: (jobs: GenerationJob[]) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    const jobs = this.getJobs();
    this.listeners.forEach((fn) => fn(jobs));
  }
}
