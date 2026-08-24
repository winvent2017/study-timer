"use client";

import { formatClock } from "@/lib/format";
import { strings } from "@/lib/strings/ko";

interface Props {
  minMinutes: number;
  elapsedSeconds: number;
  onGiveUp: () => void;
}

export default function StudyScreen({ minMinutes, elapsedSeconds, onGiveUp }: Props) {
  const totalSeconds = minMinutes * 60;
  const remaining = Math.max(0, totalSeconds - elapsedSeconds);
  const progress = Math.min(1, elapsedSeconds / totalSeconds);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-10 px-5 py-10">
      <p className="text-sm text-[var(--foreground)]/60">{strings.study.focusingMessage}</p>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent)" strokeOpacity="0.15" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        </svg>
        <span className="text-4xl font-bold tabular-nums text-[var(--foreground)]">
          {formatClock(remaining)}
        </span>
      </div>

      <p className="text-center text-sm text-[var(--foreground)]/60">
        {strings.study.minTimeMessage(minMinutes)}
      </p>

      <button
        onClick={onGiveUp}
        className="rounded-2xl border border-[var(--foreground)]/15 px-8 py-3 text-sm font-medium text-[var(--foreground)]/70 transition active:scale-[0.98]"
      >
        {strings.study.giveUpButton}
      </button>
    </div>
  );
}
