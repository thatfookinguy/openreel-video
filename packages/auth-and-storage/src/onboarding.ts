/**
 * First-run onboarding for MarketXyn Studio
 */
export type OnboardingStep =
  | "welcome"
  | "keys"
  | "affiliate-demo"
  | "done";

export interface OnboardingState {
  completed: boolean;
  step: OnboardingStep;
  skipped: boolean;
}

const KEY = "marketxyn_onboarding";

export function loadOnboarding(): OnboardingState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completed: false, step: "welcome", skipped: false };
}

export function saveOnboarding(state: OnboardingState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function completeOnboarding() {
  saveOnboarding({ completed: true, step: "done", skipped: false });
}

export function skipOnboarding() {
  saveOnboarding({ completed: true, step: "done", skipped: true });
}
