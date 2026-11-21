import { EffectRequest, EffectJob, EffectType } from "./types";

export class AIEffectsEngine {
  private jobs = new Map<string, EffectJob>();
  private listeners = new Set<(jobs: EffectJob[]) => void>();

  async apply(req: Omit<EffectRequest, "id">): Promise<string> {
    const id = crypto.randomUUID();
    const job: EffectJob = {
      id,
      request: { ...req, id },
      status: "queued",
      progress: 0,
      createdAt: Date.now(),
    };
    this.jobs.set(id, job);
    this.emit();

    // In full implementation this calls the specific engines
    // (background-removal, object-removal, subject-isolation, etc.)
    this.run(id).catch(() => {});
    return id;
  }

  private async run(id: string) {
    const job = this.jobs.get(id)!;
    this.update(id, { status: "running", progress: 10 });

    try {
      // Route to correct engine based on job.request.type
      // Placeholder success for structure
      await new Promise((r) => setTimeout(r, 800));
      this.update(id, {
        status: "succeeded",
        progress: 100,
        resultClipId: job.request.clipId,
      });
    } catch (err: any) {
      this.update(id, { status: "failed", error: err.message || String(err) });
    }
  }

  private update(id: string, patch: Partial<EffectJob>) {
    const job = this.jobs.get(id);
    if (!job) return;
    Object.assign(job, patch);
    this.emit();
  }

  getJobs() {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  subscribe(fn: (jobs: EffectJob[]) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.getJobs()));
  }
}
