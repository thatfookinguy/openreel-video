import { useState } from "react";
import { productPrompt, type ProductShotType } from "@openreel/product-studio";
import { useAIHub } from "./AIHubContext";

const SHOTS: { id: ProductShotType; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "white-bg", label: "White BG" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "packaging", label: "Packaging" },
  { id: "detail", label: "Detail" },
];

export function ProductStudioPanel() {
  const hub = useAIHub();
  const [name, setName] = useState("");
  const [shot, setShot] = useState<ProductShotType>("hero");
  const [extra, setExtra] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const run = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    setUrl("");
    try {
      const job = await hub.image.generate({
        mode: "text-to-image",
        prompt: productPrompt(name, shot, extra),
        width: 1024,
        height: 1024,
      });
      if (job.status === "failed") throw new Error(job.error || "Failed");
      if (job.resultUrl) {
        setUrl(job.resultUrl);
        const res = await fetch(job.resultUrl);
        const blob = await res.blob();
        await hub.addMediaAsset(
          new File([blob], `product-${shot}-${Date.now()}.png`, { type: "image/png" }),
          { source: "product-studio" }
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
      <h2 className="text-sm font-semibold">Product Rendering Studio</h2>
      <p className="text-xs text-text-muted">Ecommerce / ad product shots via Image Studio (fal key).</p>
      <input
        className="w-full bg-background-secondary border border-border rounded px-3 py-2 text-sm"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {SHOTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setShot(s.id)}
            className={`px-2 py-1 rounded text-xs ${
              shot === s.id ? "bg-primary text-white" : "bg-background-secondary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <textarea
        className="w-full h-16 rounded border border-border bg-background-secondary p-2 text-sm resize-none"
        placeholder="Extra (materials, angle, brand style…)"
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
      />
      <button
        onClick={run}
        disabled={busy || !name.trim()}
        className="bg-primary text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate product shot"}
      </button>
      {error && <div className="text-red-400 text-xs">{error}</div>}
      {url && <img src={url} alt="" className="rounded max-h-48 object-contain bg-black/20" />}
    </div>
  );
}
