/**
 * AI Hub – single entry point that wires all AI packages together
 *
 * Usage in the editor:
 *   import { createAIHub } from "@openreel/ai-hub";
 *   const hub = createAIHub({ addMediaAsset, addClipToTimeline, getApiKeys });
 */

export { createAIHub } from "./hub";
export type { AIHub } from "./hub";
