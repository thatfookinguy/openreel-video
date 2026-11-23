import { STUDIO_REGISTRY } from "@openreel/marketxyn-studio-hub";
import { useUXMode } from "@openreel/marketxyn-studio-hub";

/** Full MarketXyn studio map — live + scaffold modules. */
export function StudioHubPanel() {
  const mode = useUXMode((s) => s.mode);
  const setMode = useUXMode((s) => s.setMode);

  return (
    <div className="flex flex-col gap-4 overflow-auto p-1">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">MarketXyn Studio Hub</h2>
          <p className="text-xs text-text-muted">Create. Convert. Scale. — all creative departments</p>
        </div>
        <div className="flex rounded border border-border overflow-hidden text-xs">
          <button
            className={`px-3 py-1 ${mode === "simple" ? "bg-primary text-white" : "bg-background-secondary"}`}
            onClick={() => setMode("simple")}
          >
            Simple
          </button>
          <button
            className={`px-3 py-1 ${mode === "pro" ? "bg-primary text-white" : "bg-background-secondary"}`}
            onClick={() => setMode("pro")}
          >
            Pro
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {STUDIO_REGISTRY.map((s) => (
          <div
            key={s.id}
            className="border border-border rounded-lg p-3 flex items-start justify-between gap-2"
          >
            <div>
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs text-text-muted">{s.description}</div>
            </div>
            <span
              className={`text-[10px] uppercase shrink-0 px-2 py-0.5 rounded ${
                s.status === "live"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : s.status === "scaffold"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-slate-500/20 text-slate-400"
              }`}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted">
        Live modules work in AI Tools today. Scaffold modules have engines on this branch and UI is being connected next.
      </p>
    </div>
  );
}
