"use client";

import { SetRecord } from "@/types";
import { formatMultiplier } from "@/lib/messages";

export default function SummaryScreen({ sets, onRestart }: { sets: SetRecord[]; onRestart: () => void }) {
  const totalSeconds = sets.reduce((sum, s) => sum + s.elapsedSeconds, 0);
  const totalMinutes = Math.round(totalSeconds / 60);
  const best = sets.reduce((max, s) => (s.multiplier > max.multiplier ? s : max), sets[0]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-5 py-10">
      <div className="text-center">
        <p className="text-3xl">🏆</p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">오늘의 요약</h1>
      </div>

      <div className="rounded-3xl bg-[var(--accent)]/10 p-6 text-center">
        <p className="text-sm text-[var(--foreground)]/60">총 몰입시간</p>
        <p className="mt-1 text-3xl font-bold text-[var(--accent)]">{totalMinutes}분</p>
      </div>

      {best && (
        <div className="rounded-3xl bg-[var(--accent)]/10 p-5 text-center">
          <p className="text-sm text-[var(--foreground)]/60">최고 기록</p>
          <p className="mt-1 text-xl font-bold text-[var(--foreground)]">
            목표의 {formatMultiplier(best.multiplier)}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[var(--foreground)]/70">세트별 기록</p>
        {sets.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl bg-[var(--foreground)]/5 px-4 py-3"
          >
            <span className="text-sm text-[var(--foreground)]/70">세트 {i + 1}</span>
            <span className="text-sm text-[var(--foreground)]/70">
              목표 {s.targetMinutes}분 → 실제 {Math.round(s.elapsedSeconds / 60)}분
            </span>
            <span className="font-semibold text-[var(--accent)]">{formatMultiplier(s.multiplier)}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-2xl bg-[var(--accent)] py-4 text-lg font-semibold text-white shadow-md transition active:scale-[0.98]"
      >
        처음으로
      </button>
    </div>
  );
}
