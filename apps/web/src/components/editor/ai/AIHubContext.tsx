import React, { createContext, useContext, useMemo } from "react";
import { createAIHub, type AIHub } from "@openreel/ai-hub";
import { useProjectStore } from "../../../stores/project-store";
import { getMediaBridge } from "../../../bridges/media-bridge";
import { useAuthStore } from "@openreel/auth-and-storage";

const AIHubContext = createContext<AIHub | null>(null);

export function AIHubProvider({ children }: { children: React.ReactNode }) {
  const importMedia = useProjectStore((s) => s.importMedia);
  const userId = useAuthStore((s) => s.user?.id ?? null);

  const hub = useMemo(() => {
    return createAIHub({
      getCurrentUserId: () => userId,

      addMediaAsset: async (fileOrBlob, meta) => {
        // Convert Blob → File so the existing import path accepts it
        const file =
          fileOrBlob instanceof File
            ? fileOrBlob
            : new File([fileOrBlob], meta?.name || `ai-generated-${Date.now()}.mp4`, {
                type: fileOrBlob.type || "video/mp4",
              });

        // Use the real project store import so the asset appears in the media library
        const result = await importMedia(file);

        if (!result.success) {
          throw new Error(result.error?.message || "Failed to import generated media");
        }

        return result.actionId || crypto.randomUUID();
      },

      // Optional: drop onto timeline automatically (can be expanded later)
      addClipToTimeline: undefined,
    });
  }, [importMedia, userId]);

  return <AIHubContext.Provider value={hub}>{children}</AIHubContext.Provider>;
}

export function useAIHub(): AIHub {
  const hub = useContext(AIHubContext);
  if (!hub) {
    throw new Error("useAIHub must be used inside <AIHubProvider>");
  }
  return hub;
}
