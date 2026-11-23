import { useState } from "react";
import { CharacterStudioEngine } from "@openreel/character-studio";
import { useAIHub } from "./AIHubContext";
import { useMemo } from "react";

export function CharacterStudioPanel() {
  const hub = useAIHub();
  const engine = useMemo(() => new CharacterStudioEngine(), []);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [pose, setPose] = useState("front standing reference");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [chars, setChars] = useState(engine.list());

  const createAndGenerate = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    setUrl("");
    try {
      const c = engine.create(name, desc);
      setChars(engine.list());
      const job = await hub.image.generate({
        mode: "text-to-image",
        prompt: engine.posePrompt(c, pose),
        width: 1024,
        height: 1024,
      });
      if (job.status === "failed") throw new Error(job.error || "Failed");
      if (job.resultUrl) {
        setUrl(job.resultUrl);
        const res = await fetch(job.resultUrl);
        const blob = await res.blob();
        await hub.addMediaAsset(
          new File([blob], `character-${name}-${Date.now()}.png`, { type: "image/png" }),
          { source: "character-studio" }
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
      <h2 className="text-sm font-semibold">Character & Artwork Studio</h2>
      <p className="text-xs text-text-muted">
        Create a character reference and generate a pose. Consistency improves as we add vision QC later.
      </p>
      <input
        className="w-full bg-background-secondary border border-border rounded px-3 py-2 text-sm"
        placeholder="Character name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="w-full h-20 rounded border border-border bg-background-secondary p-2 text-sm resize-none"
        placeholder="Appearance (hair, outfit, age, style…)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        className="w-full bg-background-secondary border border-border rounded px-3 py-2 text-sm"
        placeholder="Pose / view"
        value={pose}
        onChange={(e) => setPose(e.target.value)}
      />
      <button
        onClick={createAndGenerate}
        disabled={busy || !name.trim()}
        className="bg-primary text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {busy ? "Generating…" : "Create & generate reference"}
      </button>
      {error && <div className="text-red-400 text-xs">{error}</div>}
      {url && <img src={url} alt="" className="rounded max-h-48 object-contain bg-black/20" />}
      {chars.length > 0 && (
        <div className="text-xs text-text-muted">Saved refs: {chars.map((c) => c.name).join(", ")}</div>
      )}
    </div>
  );
}
