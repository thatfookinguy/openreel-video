import { create } from "zustand";
import type { UXMode } from "./types";

interface ModeState {
  mode: UXMode;
  setMode: (mode: UXMode) => void;
  toggle: () => void;
}

const KEY = "marketxyn_ux_mode";

function load(): UXMode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "simple" || v === "pro") return v;
  } catch {}
  return "simple";
}

export const useUXMode = create<ModeState>((set, get) => ({
  mode: typeof window !== "undefined" ? load() : "simple",
  setMode: (mode) => {
    localStorage.setItem(KEY, mode);
    set({ mode });
  },
  toggle: () => {
    const next = get().mode === "simple" ? "pro" : "simple";
    localStorage.setItem(KEY, next);
    set({ mode: next });
  },
}));
