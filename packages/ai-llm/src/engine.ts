import type { LLMRequest, LLMResponse, LLMProviderId } from "./types";
import { OllamaProvider } from "./providers/ollama";
import { OpenRouterProvider } from "./providers/openrouter";

export class LLMEngine {
  private getApiKeys: () => Record<string, any>;

  constructor(getApiKeys: () => Record<string, any> = () => ({})) {
    this.getApiKeys = getApiKeys;
  }

  async chat(
    req: LLMRequest,
    provider: LLMProviderId = "openrouter"
  ): Promise<LLMResponse> {
    const keys = this.getApiKeys();

    if (provider === "ollama") {
      const ollama = new OllamaProvider(
        () => keys.ollama?.baseUrl || "http://127.0.0.1:11434"
      );
      return ollama.chat(req);
    }

    if (provider === "openrouter") {
      const openrouter = new OpenRouterProvider(() => keys.openrouter?.apiKey);
      return openrouter.chat(req);
    }

    throw new Error(`LLM provider "${provider}" not implemented yet`);
  }

  async listOllamaModels(): Promise<string[]> {
    const keys = this.getApiKeys();
    const ollama = new OllamaProvider(
      () => keys.ollama?.baseUrl || "http://127.0.0.1:11434"
    );
    return ollama.listModels();
  }
}
