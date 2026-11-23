import { useCallback, useState, lazy, Suspense } from "react";
import { Smartphone, Monitor, Square } from "@/icons/lucide-compat";
import { Button } from "@openreel/ui";
import { cn } from "@openreel/ui";
import { createEditorProject } from "../../services/project-creation";
import { useRouter } from "../../hooks/use-router";
import { useEditorPreload } from "../../hooks/useEditorPreload";
import { useUIStore } from "../../stores/ui-store";
import type { SocialMediaCategory } from "@openreel/core";

const RecentProjects = lazy(() =>
  import("./RecentProjects").then((m) => ({ default: m.RecentProjects }))
);

const FORMATS: {
  id: string;
  preset: SocialMediaCategory;
  label: string;
  description: string;
  dimensions: string;
  icon: React.ElementType;
}[] = [
  {
    id: "vertical",
    preset: "tiktok",
    label: "Vertical",
    description: "TikTok, Reels, Shorts",
    dimensions: "1080 × 1920",
    icon: Smartphone,
  },
  {
    id: "horizontal",
    preset: "youtube-video",
    label: "Horizontal",
    description: "YouTube, Web",
    dimensions: "1920 × 1080",
    icon: Monitor,
  },
  {
    id: "square",
    preset: "instagram-post",
    label: "Square",
    description: "Instagram, Facebook",
    dimensions: "1080 × 1080",
    icon: Square,
  },
];

interface WelcomeScreenProps {
  initialTab?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = () => {
  const { navigate } = useRouter();
  const [busy, setBusy] = useState(false);
  useEditorPreload();

  const handleCreate = useCallback(
    async (preset: SocialMediaCategory) => {
      if (busy) return;
      setBusy(true);
      try {
        await createEditorProject({ preset });
        useUIStore.getState().setSkipWelcomeScreen?.(true);
        navigate("/editor");
      } catch (e) {
        console.error(e);
        setBusy(false);
      }
    },
    [busy, navigate]
  );

  return (
    <div className="h-screen w-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
            MarketXyn Studio
          </h1>
          <p className="mt-2 text-4xl sm:text-5xl font-bold text-text-primary tracking-tight">
            Create. Convert. Scale.
          </p>
          <p className="mt-3 text-lg text-text-secondary">
            AI creative studio in your browser.
          </p>
          <p className="mt-2 text-sm text-text-muted max-w-md mx-auto">
            Research, design, video, and export — one platform. Pick a format to start.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {FORMATS.map((f) => {
            const Icon = f.icon;
            return (
              <Button
                key={f.id}
                variant="ghost"
                type="button"
                disabled={busy}
                onClick={() => handleCreate(f.preset)}
                className={cn(
                  "h-auto flex flex-col items-center gap-2 p-6 rounded-xl border border-border",
                  "bg-background-tertiary hover:bg-background-elevated hover:border-primary/40"
                )}
              >
                <Icon className="w-8 h-8 text-primary" />
                <span className="font-semibold text-text-primary">{f.label}</span>
                <span className="text-xs text-text-muted">{f.description}</span>
                <span className="text-[10px] text-text-muted">{f.dimensions}</span>
              </Button>
            );
          })}
        </div>

        <Suspense fallback={null}>
          <RecentProjects />
        </Suspense>

        <p className="mt-8 text-xs text-text-muted">
          Video engine powered by open-source OpenReel (MIT). Product layer: MarketXyn Studio.
        </p>
      </div>
    </div>
  );
};
