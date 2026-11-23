import React, { lazy, Suspense, useState, useCallback } from "react";
import {
  Mic,
  Subtitles,
  Palette,
  Music,
  Video,
  Layers,
  ChevronRight,
  Wand2,
  FileStack,
  Volume2,
  Sparkles,
  Settings,
  Eraser,
  DollarSign,
  Image,
  LayoutGrid,
  Globe,
  BadgeCheck,
  Gift,
  Package,
  User,
  Share2,
} from "@/icons/lucide-compat";
import { Button } from "@openreel/ui";
import { cn } from "@openreel/ui";

import { AutoCaptionPanel } from "./inspector/AutoCaptionPanel";
import { TextToSpeechPanel } from "./inspector/TextToSpeechPanel";
import { FilterPresetsPanel } from "./inspector/FilterPresetsPanel";
import { MusicLibraryPanel } from "./inspector/MusicLibraryPanel";
import { TemplatesBrowserPanel } from "./inspector/TemplatesBrowserPanel";
import { useTtsAudioStore } from "../../stores/tts-store";
import { toast } from "../../stores/notification-store";

import { AIVideoPanel } from "./ai/AIVideoPanel";
import { AIAudioPanel } from "./ai/AIAudioPanel";
import { AIEffectsPanel } from "./ai/AIEffectsPanel";
import { AISettingsPanel } from "./ai/AISettingsPanel";
import { AffiliateStudioPanel } from "./ai/AffiliateStudioPanel";
import { ImageStudioPanel } from "./ai/ImageStudioPanel";
import { BrandStudioPanel } from "./ai/BrandStudioPanel";
import { WebsiteStudioPanel } from "./ai/WebsiteStudioPanel";
import { StudioHubPanel } from "./ai/StudioHubPanel";
import { PersonalStudioPanel } from "./ai/PersonalStudioPanel";
import { GraphicsStudioPanel } from "./ai/GraphicsStudioPanel";
import { ProductStudioPanel } from "./ai/ProductStudioPanel";
import { CharacterStudioPanel } from "./ai/CharacterStudioPanel";
import { AIHubProvider, useAIHub } from "./ai/AIHubContext";

const MultiCameraPanel = lazy(() => import("./inspector/MultiCameraPanel"));

type FeatureId =
  | "templates" | "captions" | "tts" | "filters" | "music" | "multicam"
  | "ai-video" | "ai-audio" | "ai-effects" | "ai-settings" | "affiliate"
  | "image" | "brand" | "website" | "studio-hub" | "personal" | "graphics"
  | "product" | "character"
  | null;

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
  onClick: () => void;
}> = ({ icon: Icon, title, description, iconColor, iconBg, onClick }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    type="button"
    className={cn(
      "group/card block h-auto min-w-0 whitespace-normal rounded-[7px] border text-left p-3 w-full",
      "border-border bg-background-tertiary hover:border-border-strong hover:bg-background-elevated"
    )}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-fg-2 font-bold text-[12px] truncate">{title}</span>
          <ChevronRight size={14} className="text-text-muted shrink-0" />
        </div>
        <span className="text-fg-2 text-[10px] block truncate mt-0.5">{description}</span>
      </div>
    </div>
  </Button>
);

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({
  title,
  icon: Icon,
  children,
}) => (
  <div className="space-y-2 min-w-0">
    <div className="flex items-center gap-2 px-1">
      <Icon size={12} className="text-text-muted" />
      <span className="text-fg-2 font-bold text-[10px] uppercase">{title}</span>
    </div>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const AIGenTabInner: React.FC = () => {
  const [active, setActive] = useState<FeatureId>(null);
  const ttsHasUnsaved = useTtsAudioStore((s) => s.generatedAudio !== null && !s.isAudioSaved);
  const hub = useAIHub();

  const go = useCallback(
    (next: FeatureId) => {
      if (active === "tts" && next !== "tts" && ttsHasUnsaved) {
        toast.warning("Unsaved audio discarded", "Save to media next time to keep it.");
      }
      setActive(next);
    },
    [active, ttsHasUnsaved]
  );

  const panel = () => {
    switch (active) {
      case "templates": return <TemplatesBrowserPanel />;
      case "captions": return <AutoCaptionPanel />;
      case "tts": return <TextToSpeechPanel />;
      case "filters": return <FilterPresetsPanel />;
      case "music": return <MusicLibraryPanel />;
      case "multicam":
        return (
          <Suspense fallback={null}>
            <MultiCameraPanel />
          </Suspense>
        );
      case "ai-video": return <AIVideoPanel engine={hub.video} />;
      case "ai-audio": return <AIAudioPanel engine={hub.audio} />;
      case "ai-effects": return <AIEffectsPanel engine={hub.effects} selectedClipId={null} />;
      case "ai-settings": return <AISettingsPanel />;
      case "affiliate": return <AffiliateStudioPanel />;
      case "image": return <ImageStudioPanel />;
      case "brand": return <BrandStudioPanel />;
      case "website": return <WebsiteStudioPanel />;
      case "studio-hub": return <StudioHubPanel />;
      case "personal": return <PersonalStudioPanel />;
      case "graphics": return <GraphicsStudioPanel />;
      case "product": return <ProductStudioPanel />;
      case "character": return <CharacterStudioPanel />;
      default: return null;
    }
  };

  if (active) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto w-full min-w-0">
        <Button
          onClick={() => go(null)}
          type="button"
          className="h-8 px-3 text-[12px] justify-start rounded-none border-b border-border bg-background-secondary shrink-0"
        >
          <ChevronRight size={14} className="rotate-180 mr-1" />
          Back to AI Tools
        </Button>
        <div className="p-4 overflow-y-auto">{panel()}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-y-auto">
      <div className="p-4 space-y-6">
        <div className="text-center pb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-3">
            <Wand2 size={24} className="text-primary" />
          </div>
          <h2 className="text-[12px] font-bold text-fg-2">MarketXyn Studio</h2>
          <span className="text-[11px] text-fg-2">Create. Convert. Scale.</span>
        </div>

        <Section title="MarketXyn" icon={LayoutGrid}>
          <FeatureCard icon={LayoutGrid} title="Studio Hub" description="All modules · Simple / Pro" iconColor="text-emerald-400" iconBg="bg-emerald-500/20" onClick={() => go("studio-hub")} />
          <FeatureCard icon={Settings} title="API Keys & Settings" description="OpenRouter, Ollama, fal, ElevenLabs" iconColor="text-slate-400" iconBg="bg-slate-500/20" onClick={() => go("ai-settings")} />
        </Section>

        <Section title="Generative AI" icon={Sparkles}>
          <FeatureCard icon={Image} title="AI Image Studio" description="FLUX → media library" iconColor="text-violet-400" iconBg="bg-violet-500/20" onClick={() => go("image")} />
          <FeatureCard icon={Video} title="AI Video" description="Text / image to video" iconColor="text-purple-400" iconBg="bg-purple-500/20" onClick={() => go("ai-video")} />
          <FeatureCard icon={Music} title="AI Audio" description="Voice, music, SFX" iconColor="text-pink-400" iconBg="bg-pink-500/20" onClick={() => go("ai-audio")} />
          <FeatureCard icon={Eraser} title="AI Effects" description="BG remove, enhance" iconColor="text-amber-400" iconBg="bg-amber-500/20" onClick={() => go("ai-effects")} />
          <FeatureCard icon={DollarSign} title="Affiliate Studio" description="Research + scripts" iconColor="text-emerald-400" iconBg="bg-emerald-500/20" onClick={() => go("affiliate")} />
        </Section>

        <Section title="Design & Commerce" icon={BadgeCheck}>
          <FeatureCard icon={Palette} title="Logo & Branding" description="SVG marks + kits" iconColor="text-sky-400" iconBg="bg-sky-500/20" onClick={() => go("brand")} />
          <FeatureCard icon={Share2} title="Graphics & Marketing" description="Social / ad sizes" iconColor="text-orange-400" iconBg="bg-orange-500/20" onClick={() => go("graphics")} />
          <FeatureCard icon={Gift} title="Personal Design" description="Invites, holiday, print" iconColor="text-rose-400" iconBg="bg-rose-500/20" onClick={() => go("personal")} />
          <FeatureCard icon={Package} title="Product Studio" description="Ecommerce product shots" iconColor="text-teal-400" iconBg="bg-teal-500/20" onClick={() => go("product")} />
          <FeatureCard icon={User} title="Character Studio" description="Refs + poses" iconColor="text-indigo-400" iconBg="bg-indigo-500/20" onClick={() => go("character")} />
          <FeatureCard icon={Globe} title="Website Studio" description="Real HTML download" iconColor="text-cyan-400" iconBg="bg-cyan-500/20" onClick={() => go("website")} />
        </Section>

        <Section title="Editor tools" icon={Wand2}>
          <FeatureCard icon={Mic} title="Text to Speech" description="Built-in TTS" iconColor="text-blue-400" iconBg="bg-blue-500/20" onClick={() => go("tts")} />
          <FeatureCard icon={Subtitles} title="Auto Captions" description="Subtitles from audio" iconColor="text-primary" iconBg="bg-primary/20" onClick={() => go("captions")} />
          <FeatureCard icon={Layers} title="Project Templates" description="Start structures" iconColor="text-green-400" iconBg="bg-green-500/20" onClick={() => go("templates")} />
          <FeatureCard icon={Palette} title="Filter Presets" description="Color grades" iconColor="text-orange-400" iconBg="bg-orange-500/20" onClick={() => go("filters")} />
          <FeatureCard icon={Music} title="Music Library" description="Royalty-free audio" iconColor="text-teal-400" iconBg="bg-teal-500/20" onClick={() => go("music")} />
          <FeatureCard icon={Video} title="Multi-Camera" description="Multi-angle edit" iconColor="text-cyan-400" iconBg="bg-cyan-500/20" onClick={() => go("multicam")} />
        </Section>
      </div>
    </div>
  );
};

export const AIGenTab: React.FC = () => (
  <AIHubProvider>
    <AIGenTabInner />
  </AIHubProvider>
);
