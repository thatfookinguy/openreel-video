export type StudioId =
  | "video"
  | "affiliate"
  | "image"
  | "brand"
  | "graphics"
  | "personal"
  | "product"
  | "character"
  | "website"
  | "clipping"
  | "settings";

export type UXMode = "simple" | "pro";

export interface StudioModule {
  id: StudioId;
  name: string;
  description: string;
  phase: 0 | 1 | 2 | 3 | 4 | 5;
  status: "live" | "scaffold" | "planned";
}
