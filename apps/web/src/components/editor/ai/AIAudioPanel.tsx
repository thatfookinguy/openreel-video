import { useState, useEffect } from "react";
import type { AIAudioGenerationEngine } from "@openreel/ai-audio-gen";

interface Props {
  engine: AIAudioGenerationEngine;
}

export function AIAudioPanel({ engine }: Props) {
  const [mode, setMode] = useState<"music" | "tts" | "sfx">("music");
  const [prompt, setPrompt] = useState("");
  const [jobs, setJobs] = useState(engine.getJobs());

  useEffect(() => engine.subscribe(setJobs), [engine]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await engine.generate({
      mode,
      prompt,
      provider: "elevenlabs",
      durationSec: mode === "music" ? 30 : 5,
    });
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-auto">
      <h2 className="text-lg font-semibold">AI Audio Generation</h2>

      <div className="flex gap-2">
        <button
          onClick={() => setMode("music")}
          className={`px-3 py-1 rounded text-sm ${mode === "music" ? "bg-blue-600" : "bg-gray-800"}`}
        >
          Music
        </button>
        <button
          onClick={() => setMode("tts")}
          className={`px-3 py-1 rounded text-sm ${mode === "tts" ? "bg-blue-600" : "bg-gray-800"}`}
        >
          Voiceover
        </button>
        <button
          onClick={() => setMode("sfx")}
          className={`px-3 py-1 rounded text-sm ${mode === "sfx" ? "bg-blue-600" : "bg-gray-800"}`}
        >
          SFX
        </button>
      </div>

      <textarea
        className="w-full h-24 rounded border border-gray-700 bg-gray-900 p-2 text-sm"
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
      >
        Generate
      </button>

      <div className="flex-1 space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="border border-gray-700 rounded p-3 text-sm">
            <div className="font-medium truncate">{job.request.prompt}</div>
            <div className="text-xs text-gray-400 mt-1">
              {job.status} · {job.progress}% · {job.request.mode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
