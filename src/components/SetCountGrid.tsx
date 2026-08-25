"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { strings } from "@/lib/strings/ko";

interface Props {
  setCount: number;
  minMinutes: number;
}

interface Square {
  id: number;
  visible: boolean;
}

const COLUMNS = 5;
const CELL_HEIGHT = 60;
const GAP = 9;
const TRANSITION_MS = 250;
const VISIBLE_ROWS = 4.5;

export default function SetCountGrid({ setCount, minMinutes }: Props) {
  const [squares, setSquares] = useState<Square[]>(() =>
    Array.from({ length: setCount }, (_, i) => ({ id: i, visible: true }))
  );
  const [showFade, setShowFade] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    setSquares((prev) => {
      if (setCount === prev.length) return prev;

      if (setCount > prev.length) {
        const added = Array.from({ length: setCount - prev.length }, (_, i) => ({
          id: prev.length + i,
          visible: false,
        }));
        const next = [...prev, ...added];
        const t = window.setTimeout(() => {
          setSquares((cur) => cur.map((sq) => (sq.visible ? sq : { ...sq, visible: true })));
        }, 20);
        timeoutsRef.current.push(t);
        return next;
      }

      const next = prev.map((sq, i) => (i < setCount ? sq : { ...sq, visible: false }));
      const t = window.setTimeout(() => {
        setSquares((cur) => cur.slice(0, setCount));
      }, TRANSITION_MS);
      timeoutsRef.current.push(t);
      return next;
    });
  }, [setCount]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, []);

  function updateFade() {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setShowFade(hasOverflow && !atBottom);
  }

  useLayoutEffect(() => {
    updateFade();
  });

  const total = minMinutes * setCount;

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateFade}
          className="grid overflow-y-auto pr-1"
          style={{
            gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
            gap: GAP,
            maxHeight: VISIBLE_ROWS * (CELL_HEIGHT + GAP),
          }}
        >
          {squares.map((sq) => (
            <div
              key={sq.id}
              className="rounded-lg bg-[var(--accent)]/20 transition-all ease-out"
              style={{
                height: CELL_HEIGHT,
                transitionDuration: `${TRANSITION_MS}ms`,
                transform: sq.visible ? "scale(1)" : "scale(0.5)",
                opacity: sq.visible ? 1 : 0,
              }}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--background)] to-transparent transition-opacity duration-200"
          style={{ opacity: showFade ? 1 : 0 }}
        />
      </div>
      <p className="text-xs text-[var(--foreground)]/50">
        {strings.setup.totalTimeSummary(minMinutes, setCount, total)}
      </p>
    </div>
  );
}
