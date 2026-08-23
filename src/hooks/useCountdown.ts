"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Timestamp-based countdown, resilient to background-tab throttling.
 * totalSeconds is expected to stay constant for the component's lifetime
 * (callers remount the component when the duration changes).
 */
export function useCountdown(totalSeconds: number, running: boolean, onDone?: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    doneRef.current = false;
    const id = setInterval(() => {
      const start = startRef.current ?? Date.now();
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsed);
      setRemainingSeconds(remaining);
      if (remaining <= 0 && !doneRef.current) {
        doneRef.current = true;
        onDoneRef.current?.();
      }
    }, 250);
    return () => clearInterval(id);
  }, [running, totalSeconds]);

  return { remainingSeconds };
}
