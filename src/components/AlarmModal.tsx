"use client";

import Modal from "./Modal";
import { strings } from "@/lib/strings/ko";

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
        {strings.alarm.timeUpMessage(minMinutes)}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onRest}
          className="flex-1 rounded-2xl border border-[var(--foreground)]/15 py-3 font-medium text-[var(--foreground)]/80 transition active:scale-[0.98]"
        >
          {strings.alarm.restButton}
        </button>
        <button
          onClick={onContinue}
          className="flex-1 rounded-2xl bg-[var(--accent)] py-3 font-semibold text-white transition active:scale-[0.98]"
        >
          {strings.alarm.continueButton}
        </button>
      </div>
    </Modal>
  );
}
