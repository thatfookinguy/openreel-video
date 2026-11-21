import { useEffect, useState } from "react";
import { useAIHub } from "./AIHubContext";

/**
 * Lightweight global view of running AI jobs (video + audio).
 * Drop this near the top of the editor chrome for visibility.
 */
export function GlobalJobQueue() {
  const hub = useAIHub();
  const [videoJobs, setVideoJobs] = useState(hub.video.getJobs());
  const [audioJobs, setAudioJobs] = useState(hub.audio.getJobs());

  useEffect(() => hub.video.subscribe(setVideoJobs), [hub]);
  useEffect(() => hub.audio.subscribe(setAudioJobs), [hub]);

  const active = [
    ...videoJobs.filter((j) => j.status === "running" || j.status === "queued"),
    ...audioJobs.filter((j) => j.status === "running" || j.status === "queued"),
  ];

  if (active.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 space-y-2">
      {active.map((job: any) => (
        <div
          key={job.id}
          className="rounded-lg border border-border bg-background-secondary p-3 shadow-lg text-sm"
        >
          <div className="font-medium truncate">
            {job.request?.prompt || job.request?.mode || "AI job"}
          </div>
          <div className="text-xs text-text-muted mt-1">
            {job.status} · {job.progress ?? 0}%
          </div>
          <div className="w-full bg-background-tertiary h-1 mt-2 rounded">
            <div
              className="bg-primary h-1 rounded transition-all"
              style={{ width: `${job.progress ?? 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
