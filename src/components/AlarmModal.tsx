"use client";

import Modal from "./Modal";

interface Props {
  minMinutes: number;
  onContinue: () => void;
  onRest: () => void;
}

export default function AlarmModal({ minMinutes, onContinue, onRest }: Props) {
  return (
    <Modal>
      <p className="text-2xl">⏰</p>
      <p className="mt-3 text-lg font-medium leading-relaxed text-[var(--foreground)]">
        {minMinutes}분 다 됐어요! 더 할까요, 쉴까요?
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onRest}
          className="flex-1 rounded-2xl border border-[var(--foreground)]/15 py-3 font-medium text-[var(--foreground)]/80 transition active:scale-[0.98]"
        >
          쉬기
        </button>
        <button
          onClick={onContinue}
          className="flex-1 rounded-2xl bg-[var(--accent)] py-3 font-semibold text-white transition active:scale-[0.98]"
        >
          더 하기
        </button>
      </div>
    </Modal>
  );
}
