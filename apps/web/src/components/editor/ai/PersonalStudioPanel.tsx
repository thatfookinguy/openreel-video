import { useState } from "react";
import { PERSONAL_TEMPLATES } from "@openreel/personal-studio";
import { useAIHub } from "./AIHubContext";

export function PersonalStudioPanel() {
  const hub = useAIHub();
  const [selected, setSelected] = useState(PERSONAL_TEMPLATES[0]?.id || "");
  const [extra, setExtra] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const tpl = PERSONAL_TEMPLATES.find((t) => t.id === selected);

  const generate = async () => {
    if (!tpl) return;
    setBusy(true);
    setError("");
    setPreviewUrl("");
    try {
      const prompt = `${tpl.promptHint}. ${extra}`.trim();
      const job = await hub.image.generate({
        mode: "text-to-image",
        prompt,
        width: tpl.defaultSize.w > 1536 ? 1024 : tpl.defaultSize.w,
        height: tpl.defaultSize.h > 1536 ? 1024 : Math.min(tpl.defaultSize.h, 1536),
      });
      if (job.status === "failed") throw new Error(job.error || "Failed");
      if (job.resultUrl) {
        setPreviewUrl(job.resultUrl);
        const res = await fetch(job.resultUrl);
        const blob = await res.blob();
        await hub.addMediaAsset(
          new File([blob], `${tpl.id}-${Date.now()}.png`, { type: "image/png" }),
          { source: "personal-studio" }
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
      <h2 className="text-sm font-semibold">Personal Design Studio</h2>
      <p className="text-xs text-text-muted">
        Invitations, holiday cards, printables — generates via Image Studio and lands in the media library.
      </p>

      <select
        className="bg-background-secondary border border-border rounded px-2 py-2 text-sm"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {PERSONAL_TEMPLATES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.category})
          </option>
        ))}
      </select>

      <textarea
        className="w-full h-16 rounded border border-border bg-background-secondary p-2 text-sm resize-none"
        placeholder="Extra details (names, date, colors…)"
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
      />

      <button
        onClick={generate}
        disabled={busy}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate design"}
      </button>

      {error && <div className="text-red-400 text-xs">{error}</div>}
      {previewUrl && (
        <img src={previewUrl} alt="" className="rounded max-h-48 object-contain bg-black/20" />
      )}
    </div>
  );
}
