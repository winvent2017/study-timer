"use client";

import { useState } from "react";
import Modal from "./Modal";
import { randomGiveUpMessage } from "@/lib/messages";
import { strings } from "@/lib/strings/ko";

export default function GiveUpModal({ onClose }: { onClose: () => void }) {
  const [message] = useState(randomGiveUpMessage);

  return (
    <Modal>
      <p className="text-lg font-medium leading-relaxed text-[var(--foreground)]">{message}</p>
      <button
        onClick={onClose}
        className="mt-6 w-full rounded-2xl bg-[var(--accent)] py-3 font-semibold text-white transition active:scale-[0.98]"
      >
        {strings.giveUp.backToStartButton}
      </button>
    </Modal>
  );
}
