import type { LLMRequest, LLMResponse } from "../types";

/**
 * OpenRouter – one key, hundreds of models
 * https://openrouter.ai
 */
export class OpenRouterProvider {
  constructor(private getApiKey: () => string | undefined) {}

  async chat(req: LLMRequest): Promise<LLMResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("OpenRouter API key missing. Add it in AI Settings.");

    const model = req.model || "openai/gpt-4o-mini";

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://openreel.video",
        "X-Title": "OpenReel Affiliate Studio",
      },
      body: JSON.stringify({
        model,
        messages: req.messages,
        temperature: req.temperature ?? 0.7,
        max_tokens: req.maxTokens ?? 2048,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenRouter error: ${text}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    return {
      content,
      model: data.model || model,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
          }
        : undefined,
    };
  }
}
