import { AudioGenerationRequest, AudioGenerationJob } from "./types";

export class AIAudioGenerationEngine {
  private jobs = new Map<string, AudioGenerationJob>();
  private listeners = new Set<(jobs: AudioGenerationJob[]) => void>();

  async generate(req: Omit<AudioGenerationRequest, "id">): Promise<string> {
    const id = crypto.randomUUID();
    const job: AudioGenerationJob = {
      id,
      request: { ...req, id },
      status: "queued",
      progress: 0,
      createdAt: Date.now(),
    };
    this.jobs.set(id, job);
    this.emit();
    // Actual provider call would go here via MultiApiRouter
    return id;
  }

  getJobs() {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  subscribe(fn: (jobs: AudioGenerationJob[]) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.getJobs()));
  }
}
