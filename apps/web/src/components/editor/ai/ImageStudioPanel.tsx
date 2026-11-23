import { useState, useEffect } from "react";
import { useAIHub } from "./AIHubContext";

export function ImageStudioPanel() {
  const hub = useAIHub();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState(hub.image.getJobs());

  useEffect(() => hub.image.subscribe(setJobs), [hub.image]);

  const generate = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const job = await hub.image.generate({
        mode: "text-to-image",
        prompt,
        width: 1024,
        height: 1024,
      });

      if (job.status === "failed") {
        setError(job.error || "Generation failed");
        return;
      }

      // Import into media library when we have a URL
      if (job.resultUrl) {
        const res = await fetch(job.resultUrl);
        const blob = await res.blob();
        const file = new File([blob], `marketxyn-image-${Date.now()}.png`, {
          type: blob.type || "image/png",
        });
        await hub.addMediaAsset(file, { source: "image-studio", name: file.name });
      }
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto p-1">
      <h2 className="text-sm font-semibold">AI Image Studio</h2>
      <p className="text-xs text-text-muted">
        Text-to-image via fal.ai FLUX. Add your fal key in Settings. Results import to the media library.
      </p>

      <textarea
        className="w-full h-24 rounded border border-border bg-background-secondary p-2 text-sm resize-none"
        placeholder="Describe the image…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generate}
        disabled={busy || !prompt.trim()}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate image"}
      </button>

      {error && <div className="text-red-400 text-xs">{error}</div>}

      <div className="space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="border border-border rounded p-3 text-sm">
            <div className="font-medium truncate">{job.request.prompt}</div>
            <div className="text-xs text-text-muted mt-1">
              {job.status} · {job.progress}%
            </div>
            {job.resultUrl && (
              <img
                src={job.resultUrl}
                alt=""
                className="mt-2 rounded max-h-40 object-contain bg-black/20"
              />
            )}
            {job.error && <div className="text-red-400 text-xs mt-1">{job.error}</div>}
            {job.status === "succeeded" && (
              <div className="text-green-400 text-xs mt-1">Imported to media library</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
