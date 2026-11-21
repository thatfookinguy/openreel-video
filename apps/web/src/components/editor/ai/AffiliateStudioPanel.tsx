import { useState, useEffect } from "react";
import { useAIHub } from "./AIHubContext";

export function AffiliateStudioPanel() {
  const hub = useAIHub();
  const [productName, setProductName] = useState("");
  const [extra, setExtra] = useState("");
  const [provider, setProvider] = useState<"openrouter" | "ollama">("openrouter");
  const [product, setProduct] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [style, setStyle] = useState("short-form");
  const [platform, setPlatform] = useState("tiktok");

  const research = async () => {
    if (!productName.trim()) return;
    setBusy(true);
    setError("");
    setProduct(null);
    setScript(null);
    try {
      const result = await hub.affiliate.researchProduct(productName, extra, provider);
      setProduct(result);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const generateScript = async () => {
    if (!product) return;
    setBusy(true);
    setError("");
    try {
      const result = await hub.affiliate.generateScript(
        product,
        style as any,
        platform as any,
        provider
      );
      setScript(result);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto p-1">
      <h2 className="text-sm font-semibold">Affiliate Marketing Studio</h2>

      <div className="flex gap-2">
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as any)}
          className="bg-background-secondary border border-border rounded px-2 py-1 text-sm"
        >
          <option value="openrouter">OpenRouter</option>
          <option value="ollama">Ollama (Local)</option>
        </select>
      </div>

      <div className="space-y-2">
        <input
          className="w-full bg-background-secondary border border-border rounded px-3 py-2 text-sm"
          placeholder="Product name (e.g. NordVPN, Blue Yeti Mic, Protein Powder)"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <textarea
          className="w-full h-16 bg-background-secondary border border-border rounded px-3 py-2 text-sm resize-none"
          placeholder="Optional extra context (affiliate link, niche, offer...)"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
        />
        <button
          onClick={research}
          disabled={busy || !productName.trim()}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {busy ? "Researching…" : "Research Product"}
        </button>
      </div>

      {error && <div className="text-red-400 text-xs">{error}</div>}

      {product && (
        <div className="border border-border rounded p-3 space-y-2 text-sm">
          <div className="font-medium">{product.name}</div>
          <div className="text-xs text-text-muted">Niche: {product.niche}</div>
          <div className="text-xs">Audience: {product.targetAudience}</div>
          {product.benefits?.length > 0 && (
            <ul className="text-xs list-disc pl-4">
              {product.benefits.slice(0, 4).map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-2 pt-2">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="bg-background-secondary border border-border rounded px-2 py-1 text-xs"
            >
              <option value="short-form">Short-form</option>
              <option value="ugc">UGC</option>
              <option value="review">Review</option>
              <option value="story">Story</option>
            </select>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-background-secondary border border-border rounded px-2 py-1 text-xs"
            >
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
            <button
              onClick={generateScript}
              disabled={busy}
              className="bg-primary/80 hover:bg-primary text-white px-3 py-1 rounded text-xs"
            >
              Generate Script
            </button>
          </div>
        </div>
      )}

      {script && (
        <div className="border border-border rounded p-3 space-y-3 text-sm">
          <div className="font-medium">Script · ~{script.estimatedDurationSec}s</div>
          <div>
            <div className="text-xs text-text-muted uppercase mb-1">Hook</div>
            <div className="bg-background-secondary p-2 rounded text-xs">{script.hook}</div>
          </div>
          <div>
            <div className="text-xs text-text-muted uppercase mb-1">Body</div>
            <div className="bg-background-secondary p-2 rounded text-xs whitespace-pre-wrap">{script.body}</div>
          </div>
          <div>
            <div className="text-xs text-text-muted uppercase mb-1">CTA</div>
            <div className="bg-background-secondary p-2 rounded text-xs">{script.cta}</div>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(script.fullScript)}
            className="text-xs underline text-primary"
          >
            Copy full script
          </button>
        </div>
      )}
    </div>
  );
}
