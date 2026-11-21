import { useState, useEffect } from "react";
import type { AIEffectsEngine } from "@openreel/ai-effects";

interface Props {
  engine: AIEffectsEngine;
  selectedClipId?: string | null;
}

export function AIEffectsPanel({ engine, selectedClipId }: Props) {
  const [jobs, setJobs] = useState(engine.getJobs());

  useEffect(() => engine.subscribe(setJobs), [engine]);

  const run = (type: any, settings: any = {}) => {
    if (!selectedClipId) {
      alert("Select a clip on the timeline first");
      return;
    }
    engine.apply({ type, clipId: selectedClipId, settings });
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-auto">
      <h2 className="text-lg font-semibold">AI Effects</h2>

      {!selectedClipId && (
        <p className="text-sm text-gray-400">Select a clip on the timeline to apply effects.</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => run("background-removal", { mode: "transparent" })}
          className="bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm"
        >
          Remove BG
        </button>
        <button
          onClick={() => run("subject-isolation")}
          className="bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm"
        >
          Isolate Subject
        </button>
        <button
          onClick={() => run("object-removal")}
          className="bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm"
        >
          Remove Object
        </button>
        <button
          onClick={() => run("face-enhance", { strength: 0.7 })}
          className="bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm"
        >
          Enhance Faces
        </button>
        <button
          onClick={() => run("upscale", { scale: 2 })}
          className="bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm"
        >
          Upscale 2×
        </button>
        <button
          onClick={() => run("style-transfer")}
          className="bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm"
        >
          Style Transfer
        </button>
      </div>

      <div className="flex-1 space-y-2 mt-4">
        {jobs.map((job) => (
          <div key={job.id} className="border border-gray-700 rounded p-3 text-sm">
            <div className="font-medium">{job.request.type}</div>
            <div className="text-xs text-gray-400">
              {job.status} · {job.progress}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
