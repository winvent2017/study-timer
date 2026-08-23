"use client";

import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { formatClock } from "@/lib/format";

interface Props {
  breakMinutes: number;
  onStartNext: () => void;
  onViewSummary: () => void;
}

export default function BreakScreen({ breakMinutes, onStartNext, onViewSummary }: Props) {
  const [finished, setFinished] = useState(false);
  const { remainingSeconds } = useCountdown(breakMinutes * 60, true, () => setFinished(true));
  const progress = 1 - remainingSeconds / (breakMinutes * 60);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-10 px-5 py-10">
      <p className="text-sm text-[var(--foreground)]/60">휴식 중이에요 ☕</p>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#7bc4a4" strokeOpacity="0.15" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#7bc4a4"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        </svg>
        <span className="text-4xl font-bold tabular-nums text-[var(--foreground)]">
          {formatClock(remainingSeconds)}
        </span>
      </div>

      {finished ? (
        <div className="flex w-full flex-col items-center gap-4">
          <p className="text-center text-base font-medium text-[var(--foreground)]">
            다음 세트를 시작할까요?
          </p>
          <div className="flex w-full gap-3">
            <button
              onClick={onViewSummary}
              className="flex-1 rounded-2xl border border-[var(--foreground)]/15 py-3 font-medium text-[var(--foreground)]/80 transition active:scale-[0.98]"
            >
              오늘은 그만
            </button>
            <button
              onClick={onStartNext}
              className="flex-1 rounded-2xl bg-[var(--accent)] py-3 font-semibold text-white transition active:scale-[0.98]"
            >
              시작하기
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-[var(--foreground)]/60">잠시 눈을 쉬어가요</p>
      )}
    </div>
  );
}
