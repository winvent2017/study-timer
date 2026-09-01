"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ImmersionSequence } from "@/types";
import { strings } from "@/lib/strings/ko";

interface Props {
  sequence: ImmersionSequence;
  onStopSession: () => void;
  onDialogOpen: () => void;
  onDialogResume: () => void;
}

const PAUSE_REVEAL_MS = 3000;
const FRAME_MAX_WIDTH = 400;
const FRAME_WIDTH_VW_RATIO = 0.88;
const FRAME_MAX_HEIGHT = 560;
const FRAME_HEIGHT_VH_RATIO = 0.78;
const FRAME_TOP_MARGIN = 24;
const DRAW_DELAY_MS = 220;
const CONTENT_DELAY_MS = 780;
const CLOSE_MS = 300;
const INTERACTIVE_DELAY_MS = 1230;
const INITIAL_DASH_LENGTH = 30;

interface AnchorBox {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ImmersionSession({ sequence, onStopSession, onDialogOpen, onDialogResume }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [pauseRevealed, setPauseRevealed] = useState(false);
  const revealTimeoutRef = useRef<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogClosing, setDialogClosing] = useState(false);
  const [dialogInteractive, setDialogInteractive] = useState(false);
  const dialogTimeoutRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pauseBtnRef = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<AnchorBox | null>(null);

  const lastStepIndex = sequence.steps.length - 1;
  const currentStep = sequence.steps[stepIndex];

  useEffect(() => {
    if (stepIndex >= lastStepIndex) return;
    const duration = sequence.steps[stepIndex].durationMs;
    const t = window.setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, lastStepIndex));
    }, duration);
    return () => window.clearTimeout(t);
  }, [stepIndex, lastStepIndex, sequence]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
      if (dialogTimeoutRef.current) window.clearTimeout(dialogTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      const btn = pauseBtnRef.current;
      if (!container || !btn) return;
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setAnchor({
        width: containerRect.width,
        height: containerRect.height,
        centerX: btnRect.left + btnRect.width / 2 - containerRect.left,
        centerY: btnRect.top + btnRect.height / 2 - containerRect.top,
      });
    }

    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  function revealPause() {
    setPauseRevealed(true);
    if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
    revealTimeoutRef.current = window.setTimeout(() => setPauseRevealed(false), PAUSE_REVEAL_MS);
  }

  function handlePauseClick() {
    if (dialogOpen) return;
    onDialogOpen();
    setDialogOpen(true);
    setDialogClosing(false);
    if (dialogTimeoutRef.current) window.clearTimeout(dialogTimeoutRef.current);
    const delay = prefersReducedMotion() ? 0 : INTERACTIVE_DELAY_MS;
    dialogTimeoutRef.current = window.setTimeout(() => setDialogInteractive(true), delay);
  }

  function closeDialog() {
    setDialogInteractive(false);
    setDialogClosing(true);
    if (dialogTimeoutRef.current) window.clearTimeout(dialogTimeoutRef.current);
    const delay = prefersReducedMotion() ? 0 : CLOSE_MS;
    dialogTimeoutRef.current = window.setTimeout(() => {
      setDialogOpen(false);
      setDialogClosing(false);
    }, delay);
  }

  function handleContinue() {
    onDialogResume();
    closeDialog();
  }

  function handleStop() {
    onStopSession();
  }

  const showPause = currentStep?.type === "fade";

  const frameWidth = anchor ? Math.min(FRAME_MAX_WIDTH, anchor.width * FRAME_WIDTH_VW_RATIO) : 0;
  const maxHeightByAnchor = anchor ? Math.max(anchor.centerY - FRAME_TOP_MARGIN, 0) : 0;
  const frameHeight = anchor
    ? Math.min(FRAME_MAX_HEIGHT, anchor.height * FRAME_HEIGHT_VH_RATIO, maxHeightByAnchor)
    : 0;
  const frameLeft = anchor ? anchor.centerX - frameWidth / 2 : 0;
  const frameBottom = anchor ? anchor.centerY : 0;
  const frameTop = frameBottom - frameHeight;

  // Local (frame-relative) coordinates: bottom-center is the pause button's position.
  const localCenterX = frameWidth / 2;
  const pathLength = frameWidth + frameHeight;
  const dashStart = Math.max(pathLength - INITIAL_DASH_LENGTH, 0);

  const leftPath = `M ${localCenterX} ${frameHeight} L 0 ${frameHeight} L 0 0 L ${localCenterX} 0`;
  const rightPath = `M ${localCenterX} ${frameHeight} L ${frameWidth} ${frameHeight} L ${frameWidth} 0 L ${localCenterX} 0`;

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-dvh w-full flex-col items-center justify-center"
      onClick={revealPause}
    >
      {currentStep && (currentStep.type === "number" || currentStep.type === "text") && (
        <div
          key={stepIndex}
          className="immersion-step px-6 text-center"
          style={{ "--step-ms": `${currentStep.durationMs}ms` } as CSSProperties}
        >
          {currentStep.type === "number" ? (
            <span className="text-7xl font-thin sm:text-8xl" style={{ color: "var(--immersion-fg)" }}>
              {currentStep.content}
            </span>
          ) : (
            <p
              className="mx-auto max-w-sm whitespace-pre-line text-xl leading-relaxed tracking-wide sm:text-2xl"
              style={{ color: "var(--immersion-fg)" }}
            >
              {currentStep.content}
            </p>
          )}
        </div>
      )}

      <button
        ref={pauseBtnRef}
        type="button"
        aria-label={strings.immersionSession.pauseButtonLabel}
        onClick={(e) => {
          e.stopPropagation();
          handlePauseClick();
        }}
        onMouseEnter={revealPause}
        disabled={dialogOpen}
        className="immersion-pause-btn absolute left-1/2 top-[75%] flex -translate-x-1/2 items-center gap-2.5"
        style={{
          opacity: dialogOpen ? undefined : showPause ? (pauseRevealed ? 1 : 0.35) : 0,
          pointerEvents: showPause && !dialogOpen ? "auto" : "none",
        }}
      >
        <span
          className={`immersion-pause-bar immersion-pause-bar-left ${
            dialogOpen && !dialogClosing ? "immersion-pause-bar-animating" : ""
          }`}
        />
        <span
          className={`immersion-pause-bar immersion-pause-bar-right ${
            dialogOpen && !dialogClosing ? "immersion-pause-bar-animating" : ""
          }`}
        />
      </button>

      {dialogOpen && anchor && (
        <div
          className={`immersion-dialog-overlay ${!dialogClosing ? "is-drawing" : "is-closing"} ${
            dialogInteractive ? "is-interactive" : ""
          }`}
          style={
            {
              "--dialog-draw-delay": `${DRAW_DELAY_MS}ms`,
              "--dialog-content-delay": `${CONTENT_DELAY_MS}ms`,
              "--dialog-close-ms": `${CLOSE_MS}ms`,
            } as CSSProperties
          }
        >
          <svg
            className="immersion-dialog-frame"
            viewBox={`0 0 ${frameWidth} ${frameHeight}`}
            style={{ left: frameLeft, top: frameTop, width: frameWidth, height: frameHeight }}
            aria-hidden="true"
          >
            <path
              className="immersion-dialog-path"
              d={leftPath}
              style={{ strokeDasharray: pathLength, "--dash-start": dashStart } as CSSProperties}
            />
            <path
              className="immersion-dialog-path"
              d={rightPath}
              style={{ strokeDasharray: pathLength, "--dash-start": dashStart } as CSSProperties}
            />
          </svg>

          <div
            className="immersion-dialog-content"
            style={{ left: frameLeft, top: frameTop, width: frameWidth, height: frameHeight }}
          >
            <p className="immersion-dialog-question">{strings.pauseDialog.question}</p>
            <div className="immersion-dialog-actions">
              <button type="button" className="immersion-dialog-btn" onClick={handleContinue}>
                {strings.pauseDialog.continueButton}
              </button>
              <button type="button" className="immersion-dialog-btn" onClick={handleStop}>
                {strings.pauseDialog.stopButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
