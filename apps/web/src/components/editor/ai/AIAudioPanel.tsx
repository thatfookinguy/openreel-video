import { useState, useEffect } from "react";
import type { AIAudioGenerationEngine } from "@openreel/ai-audio-gen";

interface Props {
  engine: AIAudioGenerationEngine;
}

export function AIAudioPanel({ engine }: Props) {
  const [mode, setMode] = useState<"music" | "tts" | "sfx">("music");
  const [prompt, setPrompt] = useState("");
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
        provider: "elevenlabs",
        durationSec: mode === "music" ? 30 : 5,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto">
      <h2 className="text-sm font-semibold">AI Audio Generation</h2>

      <div className="flex gap-2">
        {(["music", "tts", "sfx"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded text-sm ${
              mode === m ? "bg-primary text-white" : "bg-background-secondary"
            }`}
          >
            {m === "music" ? "Music" : m === "tts" ? "Voiceover" : "SFX"}
          </button>
        ))}
      </div>

      <textarea
        className="w-full h-24 rounded border border-border bg-background-secondary p-2 text-sm resize-none"
        placeholder={
          mode === "music"
            ? "Describe the music (genre, mood, instruments)..."
            : mode === "tts"
            ? "Enter the text to speak..."
            : "Describe the sound effect..."
        }
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={busy || !prompt.trim()}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Starting…" : "Generate"}
      </button>

      <div className="flex-1 space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="border border-border rounded p-3 text-sm">
            <div className="font-medium truncate">{job.request.prompt}</div>
            <div className="text-xs text-text-muted mt-1">
              {job.status} · {job.progress}% · {job.request.mode}
            </div>
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
