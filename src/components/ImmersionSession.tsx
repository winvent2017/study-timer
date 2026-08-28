"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ImmersionSequence } from "@/types";
import { strings } from "@/lib/strings/ko";

interface Props {
  sequence: ImmersionSequence;
  onPause: () => void;
}

const PAUSE_REVEAL_MS = 3000;

export default function ImmersionSession({ sequence, onPause }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [pauseRevealed, setPauseRevealed] = useState(false);
  const revealTimeoutRef = useRef<number | null>(null);

  const lastStepIndex = sequence.steps.length - 1;
  const currentStep = sequence.steps[stepIndex];

  useEffect(() => {
    if (stepIndex >= lastStepIndex) return;
    const duration = sequence.steps[stepIndex].durationMs;
    const t = window.setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, lastStepIndex));
    }, duration);
    return () => window.clearTimeout(t);
  }, [stepIndex, lastStepIndex, sequence]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
    };
  }, []);

  function revealPause() {
    setPauseRevealed(true);
    if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
    revealTimeoutRef.current = window.setTimeout(() => setPauseRevealed(false), PAUSE_REVEAL_MS);
  }

  const showPause = currentStep?.type === "fade";

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center" onClick={revealPause}>
      {currentStep && (currentStep.type === "number" || currentStep.type === "text") && (
        <div
          key={stepIndex}
          className="immersion-step px-6 text-center"
          style={{ "--step-ms": `${currentStep.durationMs}ms` } as CSSProperties}
        >
          {currentStep.type === "number" ? (
            <span className="text-7xl font-thin sm:text-8xl" style={{ color: "var(--immersion-fg)" }}>
              {currentStep.content}
            </span>
          ) : (
            <p
              className="mx-auto max-w-sm whitespace-pre-line text-xl leading-relaxed tracking-wide sm:text-2xl"
              style={{ color: "var(--immersion-fg)" }}
            >
              {currentStep.content}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        aria-label={strings.immersionSession.pauseButtonLabel}
        onClick={(e) => {
          e.stopPropagation();
          onPause();
        }}
        onMouseEnter={revealPause}
        className="immersion-pause-btn absolute left-1/2 top-[75%] flex -translate-x-1/2 items-center gap-2.5"
        style={{
          opacity: showPause ? (pauseRevealed ? 1 : 0.35) : 0,
          pointerEvents: showPause ? "auto" : "none",
        }}
      >
        <span className="block h-10 w-2.5 rounded-full" style={{ background: "var(--immersion-fg)" }} />
        <span className="block h-10 w-2.5 rounded-full" style={{ background: "var(--immersion-fg)" }} />
      </button>
    </div>
  );
}
