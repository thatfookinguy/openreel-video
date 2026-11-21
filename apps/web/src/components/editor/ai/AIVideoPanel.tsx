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

  useEffect(() => engine.subscribe(setJobs), [engine]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await engine.generate({
      mode,
      prompt,
      provider,
      durationSec: 5,
      aspectRatio: "16:9",
    });
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-auto">
      <h2 className="text-lg font-semibold">AI Video Generation</h2>

      <textarea
        className="w-full h-24 rounded border border-gray-700 bg-gray-900 p-2 text-sm"
        placeholder="Describe the video you want..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex gap-2">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
        >
          <option value="text-to-video">Text → Video</option>
          <option value="image-to-video">Image → Video</option>
        </select>

        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
        >
          <option value="fal-kling">Kling (fal.ai)</option>
          <option value="runway">Runway</option>
          <option value="luma">Luma</option>
          <option value="openai-compatible">OpenAI Compatible</option>
          <option value="local-comfy">Local ComfyUI</option>
        </select>
      </div>

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
              {job.status} · {job.progress}% · {job.request.provider}
            </div>
            {job.status === "running" && (
              <div className="w-full bg-gray-800 h-1 mt-2 rounded">
                <div
                  className="bg-blue-500 h-1 rounded"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            )}
            {job.status === "failed" && (
              <div className="text-red-400 text-xs mt-1">{job.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
