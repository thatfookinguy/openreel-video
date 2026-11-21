export class MediaBridge {
  constructor(
    private addMediaAsset: (file: File | Blob, meta: any) => Promise<string>,
    private addClipToTimeline?: (mediaId: string, trackIndex?: number) => void
  ) {}

  async importGeneratedClip(
    blob: Blob,
    meta: { name: string; prompt: string; provider: string }
  ) {
    const file = new File([blob], meta.name, { type: "video/mp4" });
    const mediaId = await this.addMediaAsset(file, {
      source: "ai-generation",
      prompt: meta.prompt,
      provider: meta.provider,
      generatedAt: Date.now(),
    });

    if (this.addClipToTimeline) {
      this.addClipToTimeline(mediaId);
    }
    return mediaId;
  }
}
