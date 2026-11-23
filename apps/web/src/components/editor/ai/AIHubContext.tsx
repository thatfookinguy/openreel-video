import React, { createContext, useContext, useMemo, useEffect } from "react";
import { createAIHub, type AIHub } from "@openreel/ai-hub";
import { useProjectStore } from "../../../stores/project-store";
import { useAuthStore, ensureGuestUser } from "@openreel/auth-and-storage";

const AIHubContext = createContext<AIHub | null>(null);

export function AIHubProvider({ children }: { children: React.ReactNode }) {
  const importMedia = useProjectStore((s) => s.importMedia);
  const userId = useAuthStore((s) => s.user?.id ?? null);

  // Phase 0: always have a local guest so keys + hub work without a login screen
  useEffect(() => {
    ensureGuestUser();
  }, []);

  const hub = useMemo(() => {
    return createAIHub({
      getCurrentUserId: () => useAuthStore.getState().user?.id ?? "guest",

      addMediaAsset: async (fileOrBlob, meta) => {
        const file =
          fileOrBlob instanceof File
            ? fileOrBlob
            : new File([fileOrBlob], meta?.name || `ai-generated-${Date.now()}.mp4`, {
                type: fileOrBlob.type || "video/mp4",
              });

        const result = await importMedia(file);

        if (!result.success) {
          throw new Error(
            (result as any).error?.message || "Failed to import generated media"
          );
        }

        return (result as any).actionId || crypto.randomUUID();
      },

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
