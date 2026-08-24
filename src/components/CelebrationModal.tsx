"use client";

import Modal from "./Modal";
import Confetti from "./Confetti";
import { SetRecord } from "@/types";
import { celebrationLine } from "@/lib/messages";
import { strings } from "@/lib/strings/ko";

interface Props {
  record: SetRecord;
  isFinalSet: boolean;
  onNextSet: () => void;
  onRest: () => void;
  onViewSummary: () => void;
}

export default function CelebrationModal({ record, isFinalSet, onNextSet, onRest, onViewSummary }: Props) {
  return (
    <>
      <Confetti />
      <Modal>
        <p className="text-3xl">🎉</p>
        <p className="mt-3 text-lg font-medium leading-relaxed text-[var(--foreground)]">
          {celebrationLine(record.targetMinutes, record.elapsedSeconds, record.multiplier)}
        </p>

        {isFinalSet ? (
          <button
            onClick={onViewSummary}
            className="mt-6 w-full rounded-2xl bg-[var(--accent)] py-3 font-semibold text-white transition active:scale-[0.98]"
          >
            {strings.celebration.viewSummaryButton}
          </button>
        ) : (
          <div className="mt-6 flex flex-col gap-2.5">
            <div className="flex gap-3">
              <button
                onClick={onRest}
                className="flex-1 rounded-2xl border border-[var(--foreground)]/15 py-3 font-medium text-[var(--foreground)]/80 transition active:scale-[0.98]"
              >
                {strings.celebration.restButton}
              </button>
              <button
                onClick={onNextSet}
                className="flex-1 rounded-2xl bg-[var(--accent)] py-3 font-semibold text-white transition active:scale-[0.98]"
              >
                {strings.celebration.nextSetButton}
              </button>
            </div>
            <button
              onClick={onViewSummary}
              className="text-sm text-[var(--foreground)]/50 underline-offset-2 transition hover:underline"
            >
              {strings.celebration.stopAndViewSummaryButton}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
