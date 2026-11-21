import type { LLMRequest, LLMResponse } from "../types";

/**
 * Ollama – fully local, no API key required
 * Default: http://127.0.0.1:11434
 */
export class OllamaProvider {
  constructor(private getBaseUrl: () => string = () => "http://127.0.0.1:11434") {}

  async chat(req: LLMRequest): Promise<LLMResponse> {
    const base = this.getBaseUrl().replace(/\/$/, "");
    const model = req.model || "llama3.2";

    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: req.messages,
        stream: false,
        options: {
          temperature: req.temperature ?? 0.7,
          num_predict: req.maxTokens ?? 2048,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ollama error: ${text}. Is Ollama running at ${base}?`);
    }

    const data = await res.json();
    return {
      content: data.message?.content || "",
      model: data.model || model,
    };
  }

  async listModels(): Promise<string[]> {
    const base = this.getBaseUrl().replace(/\/$/, "");
    try {
      const res = await fetch(`${base}/api/tags`);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.models || []).map((m: any) => m.name);
    } catch {
      return [];
    }
  }
}
