import { useState } from "react";
import { useAIHub } from "./AIHubContext";

export function WebsiteStudioPanel() {
  const hub = useAIHub();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [files, setFiles] = useState<{ filename: string; html: string }[]>([]);

  const build = () => {
    if (!name.trim()) return;
    const out = hub.website.buildStaticSite({
      name,
      tagline,
      primaryColor: "#10b981",
      pages: [
        {
          slug: "index",
          title: "Home",
          sections: ["Hero", "Features", "About", "Contact"],
        },
        {
          slug: "about",
          title: "About",
          sections: ["Our Story", "Team"],
        },
      ],
    });
    setFiles(out);
  };

  const download = (filename: string, html: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto p-1">
      <h2 className="text-sm font-semibold">Website Studio</h2>
      <p className="text-xs text-text-muted">
        Generates real HTML/CSS pages (not screenshots). Download and host anywhere.
      </p>

      <input
        className="w-full bg-background-secondary border border-border rounded px-3 py-2 text-sm"
        placeholder="Business / site name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full bg-background-secondary border border-border rounded px-3 py-2 text-sm"
        placeholder="Tagline (optional)"
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
      />

      <button
        onClick={build}
        disabled={!name.trim()}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
      >
        Generate site files
      </button>

      {files.map((f) => (
        <div key={f.filename} className="border border-border rounded p-3 text-sm flex justify-between gap-2">
          <span className="font-mono text-xs">{f.filename}</span>
          <button className="text-xs underline text-primary" onClick={() => download(f.filename, f.html)}>
            Download
          </button>
        </div>
      ))}
    </div>
  );
}
