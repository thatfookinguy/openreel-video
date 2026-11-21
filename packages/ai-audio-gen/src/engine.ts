import { AudioGenerationRequest, AudioGenerationJob } from "./types";
import { ElevenLabsProvider } from "./providers/elevenlabs";

export class AIAudioGenerationEngine {
  private jobs = new Map<string, AudioGenerationJob>();
  private listeners = new Set<(jobs: AudioGenerationJob[]) => void>();
  private getApiKeys: () => Record<string, any>;
  private onResult?: (blob: Blob, meta: any) => Promise<void>;

  constructor(
    getApiKeys: () => Record<string, any> = () => ({}),
    onResult?: (blob: Blob, meta: any) => Promise<void>
  ) {
    this.getApiKeys = getApiKeys;
    this.onResult = onResult;
  }

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
    this.runJob(id).catch(() => {});
    return id;
  }

  private async runJob(id: string) {
    const job = this.jobs.get(id);
    if (!job) return;

    try {
      this.update(id, { status: "running", progress: 5 });

      const keys = this.getApiKeys();
      const eleven = new ElevenLabsProvider(
        () => keys.elevenlabs?.apiKey
      );

      let blob: Blob;

      if (job.request.mode === "tts" || job.request.mode === "voice-clone") {
        blob = await eleven.textToSpeech(
          job.request.prompt,
          job.request.voiceId,
          (p) => this.update(id, { progress: p })
        );
      } else if (job.request.mode === "sfx") {
        blob = await eleven.soundEffects(
          job.request.prompt,
          job.request.durationSec || 5,
          (p) => this.update(id, { progress: p })
        );
      } else {
        // music
        blob = await eleven.music(
          job.request.prompt,
          job.request.durationSec || 30,
          (p) => this.update(id, { progress: p })
        );
      }

      this.update(id, {
        status: "succeeded",
        progress: 100,
        resultBlob: blob,
      });

      if (this.onResult) {
        await this.onResult(blob, {
          name: `AI_${job.request.mode}_${Date.now()}.mp3`,
          prompt: job.request.prompt,
          mode: job.request.mode,
        });
      }
    } catch (err: any) {
      this.update(id, {
        status: "failed",
        error: err?.message || String(err),
        progress: 0,
      });
    }
  }

  private update(id: string, patch: Partial<AudioGenerationJob>) {
    const job = this.jobs.get(id);
    if (!job) return;
    Object.assign(job, patch);
    this.emit();
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
