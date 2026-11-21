import { useState, useEffect } from "react";
import { useAuthStore, PROVIDERS, saveApiKeys, loadApiKeys } from "@openreel/auth-and-storage";

export function AISettingsPanel() {
  const { user, isAuthenticated } = useAuthStore();
  const [keys, setKeys] = useState<Record<string, any>>({});

  useEffect(() => {
    if (user?.id) {
      setKeys(loadApiKeys(user.id));
    }
  }, [user?.id]);

  const handleSave = () => {
    if (!user?.id) return;
    saveApiKeys(user.id, keys);
    alert("API keys saved locally (encrypted per user)");
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-sm text-gray-400">
        Please log in to manage API keys.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl overflow-auto">
      <h2 className="text-xl font-bold">AI API Keys</h2>
      <p className="text-sm text-gray-400">
        Keys are stored only on this device and encrypted for your account.
        They never leave your browser unless you enable optional cloud sync.
      </p>

      {PROVIDERS.map((p) => (
        <div key={p.id} className="border border-gray-700 rounded-lg p-4 space-y-3">
          <h3 className="font-medium">{p.name}</h3>
          {p.fields.map((field) => (
            <input
              key={field}
              type={field === "apiKey" ? "password" : "text"}
              placeholder={field}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Save Keys
      </button>
    </div>
  );
}
