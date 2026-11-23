import { useState, useEffect } from "react";
import {
  useAuthStore,
  PROVIDERS,
  saveApiKeys,
  loadApiKeys,
  ensureGuestUser,
} from "@openreel/auth-and-storage";

export function AISettingsPanel() {
  const user = useAuthStore((s) => s.user);
  const [keys, setKeys] = useState<Record<string, any>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    ensureGuestUser();
  }, []);

  useEffect(() => {
    const id = user?.id || "guest";
    setKeys(loadApiKeys(id));
  }, [user?.id]);

  const handleSave = () => {
    const id = useAuthStore.getState().user?.id || "guest";
    saveApiKeys(id, keys);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto p-1">
      <h2 className="text-sm font-semibold">MarketXyn — API Keys & Settings</h2>
      <p className="text-xs text-text-muted">
        Keys stay on this device. Used for Affiliate Studio, AI Video, AI Audio, and LLMs.
      </p>

      {PROVIDERS.map((p) => (
        <div key={p.id} className="border border-border rounded-lg p-3 space-y-2">
          <h3 className="text-sm font-medium">{p.name}</h3>
          {p.fields.map((field) => (
            <input
              key={field}
              type={field === "apiKey" ? "password" : "text"}
              placeholder={
                field === "baseUrl"
                  ? "http://127.0.0.1:11434"
                  : field === "apiKey"
                  ? "API key"
                  : field
              }
              className="w-full bg-background-secondary border border-border rounded px-3 py-2 text-sm"
              value={keys[p.id]?.[field] || ""}
              onChange={(e) =>
                setKeys({
                  ...keys,
                  [p.id]: { ...keys[p.id], [field]: e.target.value },
                })
              }
            />
          ))}
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium"
      >
        {saved ? "Saved" : "Save Keys"}
      </button>
    </div>
  );
}
