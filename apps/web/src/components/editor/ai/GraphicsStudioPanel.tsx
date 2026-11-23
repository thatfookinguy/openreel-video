import { PLATFORM_SIZES } from "@openreel/graphics-studio";
import { useState } from "react";
import { useAIHub } from "./AIHubContext";

export function GraphicsStudioPanel() {
  const hub = useAIHub();
  const presets = Object.entries(PLATFORM_SIZES);
  const [presetId, setPresetId] = useState("ig-post");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const preset = PLATFORM_SIZES[presetId];

  const generate = async () => {
    if (!prompt.trim() || !preset) return;
    setBusy(true);
    setError("");
    setUrl("");
    try {
      // Cap at 1280 for API speed; note target size in prompt
      const w = Math.min(preset.w, 1280);
      const h = Math.min(preset.h, 1280);
      const job = await hub.image.generate({
        mode: "text-to-image",
        prompt: `${prompt}. Format: ${preset.label} ${preset.w}x${preset.h}.`,
        width: w,
        height: h,
      });
      if (job.status === "failed") throw new Error(job.error || "Failed");
      if (job.resultUrl) {
        setUrl(job.resultUrl);
        const res = await fetch(job.resultUrl);
        const blob = await res.blob();
        await hub.addMediaAsset(
          new File([blob], `${presetId}-${Date.now()}.png`, { type: "image/png" }),
          { source: "graphics-studio" }
        );
      }
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto p-1">
      <h2 className="text-sm font-semibold">Graphics & Marketing Studio</h2>
      <p className="text-xs text-text-muted">Platform-sized creatives. Pick a preset, describe the ad, generate.</p>

      <select
        className="bg-background-secondary border border-border rounded px-2 py-2 text-sm"
        value={presetId}
        onChange={(e) => setPresetId(e.target.value)}
      >
        {presets.map(([id, p]) => (
          <option key={id} value={id}>
            {p.label} ({p.w}×{p.h})
          </option>
        ))}
      </select>

      <textarea
        className="w-full h-20 rounded border border-border bg-background-secondary p-2 text-sm resize-none"
        placeholder="Ad / post description…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generate}
        disabled={busy || !prompt.trim()}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate graphic"}
      </button>

      {error && <div className="text-red-400 text-xs">{error}</div>}
      {url && <img src={url} alt="" className="rounded max-h-48 object-contain bg-black/20" />}
    </div>
  );
}
