import { useState, useEffect } from "react";
import type { AIVideoGenerationEngine } from "@openreel/ai-video-gen";

interface Props {
  engine: AIVideoGenerationEngine;
}

export function AIVideoPanel({ engine }: Props) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"text-to-video" | "image-to-video">("text-to-video");
  const [provider, setProvider] = useState("fal-kling");
  const [jobs, setJobs] = useState(engine.getJobs());
  const [busy, setBusy] = useState(false);

  useEffect(() => engine.subscribe(setJobs), [engine]);

  const handleGenerate = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    try {
      await engine.generate({
        mode,
        prompt,
        provider,
        durationSec: 5,
        aspectRatio: "16:9",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto">
      <h2 className="text-sm font-semibold">AI Video Generation</h2>

      <textarea
        className="w-full h-24 rounded border border-border bg-background-secondary p-2 text-sm resize-none"
        placeholder="Describe the video you want..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex gap-2 flex-wrap">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="bg-background-secondary border border-border rounded px-2 py-1 text-sm"
        >
          <option value="text-to-video">Text → Video</option>
          <option value="image-to-video">Image → Video</option>
        </select>

        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="bg-background-secondary border border-border rounded px-2 py-1 text-sm"
        >
          <option value="fal-kling">Kling (fal.ai)</option>
          <option value="openai-compatible">OpenAI Compatible</option>
          <option value="local-comfy">Local ComfyUI</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={busy || !prompt.trim()}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Starting…" : "Generate"}
      </button>

      <div className="flex-1 space-y-2">
        {jobs.length === 0 && (
          <p className="text-xs text-text-muted">No jobs yet. Generated clips appear in the media library.</p>
        )}
        {jobs.map((job) => (
          <div key={job.id} className="border border-border rounded p-3 text-sm">
            <div className="font-medium truncate">{job.request.prompt}</div>
            <div className="text-xs text-text-muted mt-1">
              {job.status} · {job.progress}% · {job.request.provider}
            </div>
            {job.status === "running" && (
              <div className="w-full bg-background-tertiary h-1 mt-2 rounded">
                <div className="bg-primary h-1 rounded transition-all" style={{ width: `${job.progress}%` }} />
              </div>
            )}
            {job.status === "failed" && (
              <div className="text-red-400 text-xs mt-1">{job.error}</div>
            )}
            {job.status === "succeeded" && (
              <div className="text-green-400 text-xs mt-1">Imported to media library</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
