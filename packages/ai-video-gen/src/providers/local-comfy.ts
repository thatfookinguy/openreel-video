import { GenerationRequest } from "../types";

/**
 * Local ComfyUI provider (placeholder)
 * Point baseUrl to your local ComfyUI instance (e.g. http://127.0.0.1:8188)
 */
export class LocalComfyProvider {
  constructor(private getBaseUrl: () => string | undefined) {}

  async generate(
    req: GenerationRequest,
    onProgress: (p: number) => void
  ): Promise<Blob> {
    const base = this.getBaseUrl() || "http://127.0.0.1:8188";

    onProgress(5);

    // This is a simplified example. In practice you would:
    // 1. Load a workflow JSON for SVD / AnimateDiff / LTX / etc.
    // 2. Queue the prompt via /prompt
    // 3. Poll /history
    // 4. Download the output video from /view

    throw new Error(
      `Local ComfyUI provider is a placeholder. ` +
        `Point your Settings → Local ComfyUI base URL to ${base} and implement the workflow you want.`
    );
  }
}
