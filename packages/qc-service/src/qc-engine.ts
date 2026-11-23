import type { QCInput, QCIssue, QCReport } from "./types";

/**
 * Quality-control gate.
 * Phase 0/1: programmatic checks (text, dimensions).
 * Later: vision model for artifacts + character consistency.
 */
export class QCEngine {
  async inspect(input: QCInput): Promise<QCReport> {
    const issues: QCIssue[] = [];

    if (input.text != null) {
      if (!input.text.trim()) {
        issues.push({
          type: "text-integrity",
          severity: "error",
          message: "Text content is empty",
          field: "text",
        });
      }
      // Basic repeated character / garbage detection
      if (/(.)\1{8,}/.test(input.text)) {
        issues.push({
          type: "text-integrity",
          severity: "warning",
          message: "Possible garbled or repeated characters in text",
          field: "text",
        });
      }
    }

    if (input.expectedText && input.text) {
      const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
      if (norm(input.text) !== norm(input.expectedText)) {
        issues.push({
          type: "script-match",
          severity: "error",
          message: "Output text does not match expected / approved script",
          field: "text",
        });
      }
    }

    if (input.width && input.minWidth && input.width < input.minWidth) {
      issues.push({
        type: "resolution",
        severity: "error",
        message: `Width ${input.width} below minimum ${input.minWidth}`,
      });
    }
    if (input.height && input.minHeight && input.height < input.minHeight) {
      issues.push({
        type: "resolution",
        severity: "error",
        message: `Height ${input.height} below minimum ${input.minHeight}`,
      });
    }

    if (input.width && input.height && input.requiredAspect) {
      const [aw, ah] = input.requiredAspect.split(":").map(Number);
      if (aw && ah) {
        const target = aw / ah;
        const actual = input.width / input.height;
        if (Math.abs(target - actual) > 0.05) {
          issues.push({
            type: "aspect-ratio",
            severity: "warning",
            message: `Aspect ~${actual.toFixed(2)} vs required ${input.requiredAspect}`,
          });
        }
      }
    }

    const errors = issues.filter((i) => i.severity === "error").length;
    const warnings = issues.filter((i) => i.severity === "warning").length;
    const score = Math.max(0, 100 - errors * 25 - warnings * 10);

    return {
      passed: errors === 0,
      score,
      issues,
      requiresHumanReview: errors > 0 || score < 70,
    };
  }
}
