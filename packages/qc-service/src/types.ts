export type QCCheckType =
  | "text-integrity"
  | "image-artifacts"
  | "resolution"
  | "aspect-ratio"
  | "character-consistency"
  | "script-match"
  | "subtitle-accuracy"
  | "audio-sync";

export interface QCIssue {
  type: QCCheckType;
  severity: "error" | "warning" | "info";
  message: string;
  field?: string;
}

export interface QCReport {
  passed: boolean;
  score: number; // 0-100
  issues: QCIssue[];
  requiresHumanReview: boolean;
}

export interface QCInput {
  kind: "image" | "video" | "audio" | "text" | "script-vs-narration";
  /** Plain text to validate (titles, logos text, scripts) */
  text?: string;
  expectedText?: string;
  width?: number;
  height?: number;
  requiredAspect?: string;
  minWidth?: number;
  minHeight?: number;
}
