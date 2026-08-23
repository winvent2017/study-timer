"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Timestamp-based stopwatch so elapsed time stays correct even if the tab
 * is backgrounded and setInterval ticks get throttled.
 * onTick fires from inside the interval callback (not the effect body) so
 * it can safely trigger state updates in the caller.
 */
export function useStopwatch(running: boolean, onTick?: (elapsedSeconds: number) => void) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!running) return;
    if (startRef.current === null) {
      startRef.current = Date.now();
    }
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = accumulatedRef.current + (now - (startRef.current ?? now));
      const seconds = Math.floor(elapsed / 1000);
      setElapsedSeconds(seconds);
      onTickRef.current?.(seconds);
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running && startRef.current !== null) {
      accumulatedRef.current += Date.now() - startRef.current;
      startRef.current = null;
    }
  }, [running]);

  function reset() {
    startRef.current = running ? Date.now() : null;
    accumulatedRef.current = 0;
    setElapsedSeconds(0);
  }

  return { elapsedSeconds, reset };
}
