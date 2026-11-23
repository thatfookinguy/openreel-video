import { KNOWN_PROVIDERS, type ModelCapability, type ModelProvider } from "./types";

export class ModelRouter {
  constructor(private getKeys: () => Record<string, any> = () => ({})) {}

  listFor(capability: ModelCapability): ModelProvider[] {
    return KNOWN_PROVIDERS.filter((p) => p.capabilities.includes(capability));
  }

  /** Prefer local free when available, else first key-backed provider the user has configured. */
  pick(capability: ModelCapability, preferLocal = false): ModelProvider | null {
    const candidates = this.listFor(capability);
    const keys = this.getKeys();

    if (preferLocal) {
      const local = candidates.find((p) => p.local);
      if (local) return local;
    }

    for (const p of candidates) {
      if (!p.requiresKey) return p;
      const entry = keys[p.id];
      if (entry?.apiKey || entry?.baseUrl) return p;
    }

    return candidates[0] || null;
  }
}
