"use client";

import { strings } from "@/lib/strings/ko";

export default function ImmersionMode({ onStop }: { onStop: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-10 px-5 py-10">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="animate-gentle-spin absolute inset-0 rounded-full border-4 border-[var(--accent)]/20 border-t-[var(--accent)]" />
        <span className="animate-book-bounce text-6xl">📖</span>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-[var(--foreground)]">{strings.immersion.title}</p>
        <p className="mt-2 text-sm text-[var(--foreground)]/60">
          {strings.immersion.subtitle}
        </p>
      </div>

      <button
        onClick={onStop}
        className="rounded-2xl bg-[var(--accent)] px-10 py-3 font-semibold text-white shadow-md transition active:scale-[0.98]"
      >
        {strings.immersion.stopButton}
      </button>
    </div>
  );
}
