import { GenerationRequest, GenerationJob } from "./types";
import { MediaBridge } from "./media-bridge";

export class AIVideoGenerationEngine {
  private jobs = new Map<string, GenerationJob>();
  private providers = new Map<string, any>();
  private mediaBridge: MediaBridge;
  private listeners = new Set<(jobs: GenerationJob[]) => void>();

  constructor(mediaBridge: MediaBridge) {
    this.mediaBridge = mediaBridge;
    // Providers registered externally or via multi-api router
  }

  registerProvider(id: string, provider: any) {
    this.providers.set(id, provider);
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

    const provider = this.providers.get(job.request.provider);
    if (!provider) {
      this.fail(id, `Unknown provider: ${job.request.provider}`);
      return;
    }

    try {
      this.update(id, { status: "running", progress: 5 });

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
      this.fail(id, err?.message || String(err));
    }
  }

  private update(id: string, patch: Partial<GenerationJob>) {
    const job = this.jobs.get(id);
    if (!job) return;
    Object.assign(job, patch, { updatedAt: Date.now() });
    this.emit();
  }

  private fail(id: string, error: string) {
    this.update(id, { status: "failed", error, progress: 0 });
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
