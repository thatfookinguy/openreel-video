import { useState } from "react";
import {
  loadOnboarding,
  completeOnboarding,
  skipOnboarding,
  type OnboardingStep,
} from "@openreel/auth-and-storage";

export function OnboardingOverlay({ onDone }: { onDone?: () => void }) {
  const initial = loadOnboarding();
  const [step, setStep] = useState<OnboardingStep>(
    initial.completed ? "done" : initial.step
  );

  if (step === "done" || initial.completed) return null;

  const next = () => {
    if (step === "welcome") setStep("keys");
    else if (step === "keys") setStep("affiliate-demo");
    else {
      completeOnboarding();
      setStep("done");
      onDone?.();
    }
  };

  const skip = () => {
    skipOnboarding();
    setStep("done");
    onDone?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-8 shadow-2xl">
        {step === "welcome" && (
          <>
            <h1 className="text-2xl font-bold mb-2">Welcome to MarketXyn Studio</h1>
            <p className="text-text-secondary mb-1 font-medium">Create. Convert. Scale.</p>
            <p className="text-sm text-text-muted mb-6">
              Research products, generate scripts, produce AI video & voice, and export
              ready-to-post content — all in one place.
            </p>
            <button onClick={next} className="w-full bg-primary text-white py-3 rounded-lg font-medium">
              Get started
            </button>
            <button onClick={skip} className="w-full mt-2 text-sm text-text-muted underline">
              Skip for now
            </button>
          </>
        )}

        {step === "keys" && (
          <>
            <h2 className="text-xl font-bold mb-2">Connect your AI keys</h2>
            <p className="text-sm text-text-muted mb-4">
              Open <strong>AI Tools → API Keys & Settings</strong> and add:
            </p>
            <ul className="text-sm space-y-2 mb-6 list-disc pl-5">
              <li><strong>OpenRouter</strong> — research & scripts (or use local Ollama)</li>
              <li><strong>fal.ai</strong> — AI video generation</li>
              <li><strong>ElevenLabs</strong> — voiceovers & music</li>
            </ul>
            <p className="text-xs text-text-muted mb-4">
              Keys stay on this device and are encrypted per account.
            </p>
            <button onClick={next} className="w-full bg-primary text-white py-3 rounded-lg font-medium">
              I've added my keys
            </button>
            <button onClick={skip} className="w-full mt-2 text-sm text-text-muted underline">
              Skip
            </button>
          </>
        )}

        {step === "affiliate-demo" && (
          <>
            <h2 className="text-xl font-bold mb-2">Your first affiliate video</h2>
            <ol className="text-sm space-y-2 mb-6 list-decimal pl-5">
              <li>Open <strong>Affiliate Studio</strong></li>
              <li>Enter a product → Research → Generate Script</li>
              <li>Copy the script into <strong>AI Audio</strong> for a voiceover</li>
              <li>Generate B-roll in <strong>AI Video</strong></li>
              <li>Drop both on the timeline → Export</li>
            </ol>
            <button onClick={next} className="w-full bg-primary text-white py-3 rounded-lg font-medium">
              Let's go
            </button>
          </>
        )}
      </div>
    </div>
  );
}
