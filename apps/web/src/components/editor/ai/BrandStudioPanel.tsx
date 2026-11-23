import { useState } from "react";
import { useAIHub } from "./AIHubContext";

export function BrandStudioPanel() {
  const hub = useAIHub();
  const [name, setName] = useState("");
  const [primary, setPrimary] = useState("#10b981");
  const [secondary, setSecondary] = useState("#0f172a");
  const [svg, setSvg] = useState("");

  const generate = () => {
    if (!name.trim()) return;
    const mark = hub.brand.generateMarkSvg(name, primary, secondary);
    setSvg(mark);
    hub.brand.createKit({
      name,
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: primary,
      fonts: ["system-ui"],
      logoSvg: mark,
    });
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase() || "logo"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto p-1">
      <h2 className="text-sm font-semibold">Logo & Branding Studio</h2>
      <p className="text-xs text-text-muted">
        SVG-first logo marks with programmatic text (no garbled AI lettering). Expand with AI exploration later.
      </p>

      <input
        className="w-full bg-background-secondary border border-border rounded px-3 py-2 text-sm"
        placeholder="Brand name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex gap-3 items-center text-sm">
        <label className="flex items-center gap-2">
          Primary
          <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          Secondary
          <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} />
        </label>
      </div>

      <button
        onClick={generate}
        disabled={!name.trim()}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
      >
        Generate SVG mark
      </button>

      {svg && (
        <div className="space-y-2">
          <div
            className="border border-border rounded p-4 bg-background-secondary flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <button onClick={downloadSvg} className="text-xs underline text-primary">
            Download SVG
          </button>
        </div>
      )}
    </div>
  );
}
