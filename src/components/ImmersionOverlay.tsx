"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ImmersionSequence, ImmersionStep } from "@/types";
import { strings } from "@/lib/strings/ko";
import { MEASUREMENT_START_STEP_INDEX } from "@/lib/immersionSequences";

// 시작하기를 누른 세트 사각형의 화면 좌표 (FLIP 확장의 원본)
export interface SourceRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Props {
  sequence: ImmersionSequence;
  sourceRect: SourceRect | null;
  setNumber: number; // 세션 내에서 지금 시작하는 세트의 1-based 순번
  onExpandComplete: () => void;
  onMeasureStart: () => void;
}

const EXPAND_MS = 800;
const SOURCE_RADIUS = "0.5rem"; // 그리드 사각형의 rounded-lg와 동일

type DimStartStep = Extract<ImmersionStep, { type: "dimStart" }>;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setDimProgress(p: number) {
  document.documentElement.style.setProperty("--immersion-p", String(p));
}

export default function ImmersionOverlay({
  sequence,
  sourceRect,
  setNumber,
  onExpandComplete,
  onMeasureStart,
}: Props) {
  // 마운트 시점에 한 번만 판정해 고정 (감속 모션 여부)
  const [reduced] = useState(prefersReducedMotion);
  const skipExpand = reduced || !sourceRect;
  const [settled, setSettled] = useState(skipExpand);
  const [stepIndex, setStepIndex] = useState(-1);

  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const dimTimeoutRef = useRef<number | null>(null);
  const sequenceStartedRef = useRef(false);

  const onExpandCompleteRef = useRef(onExpandComplete);
  const onMeasureStartRef = useRef(onMeasureStart);
  useEffect(() => {
    onExpandCompleteRef.current = onExpandComplete;
    onMeasureStartRef.current = onMeasureStart;
  }, [onExpandComplete, onMeasureStart]);

  // 오버레이가 떠 있는 동안 페이지 스크롤 잠금 + 종료 시 어두워짐 상태 초기화
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dimTimeouts = dimTimeoutRef;
    const rafs = rafRef;
    return () => {
      document.body.style.overflow = prevOverflow;
      if (rafs.current !== null) cancelAnimationFrame(rafs.current);
      if (dimTimeouts.current !== null) window.clearTimeout(dimTimeouts.current);
      document.documentElement.style.removeProperty("--immersion-p");
    };
  }, []);

  // FLIP 확장: 렌더된 원본 사각형 스타일로 레이아웃을 확정(강제 리플로우)한 뒤,
  // 페인트 전에 전체 화면 스타일로 직접 전환해 CSS transition을 발동시킨다.
  useLayoutEffect(() => {
    if (skipExpand) return;
    const el = overlayRef.current;
    if (!el) return;
    el.getBoundingClientRect();
    el.style.top = "0px";
    el.style.left = "0px";
    el.style.width = "100vw";
    el.style.height = "100dvh";
    el.style.borderRadius = "0";
    const t = window.setTimeout(() => setSettled(true), EXPAND_MS);
    return () => window.clearTimeout(t);
  }, [skipExpand]);

  // 확장 완료: 버튼 라벨 교체 + 텍스트 시퀀스 시작
  useEffect(() => {
    if (!settled || sequenceStartedRef.current) return;
    sequenceStartedRef.current = true;
    onExpandCompleteRef.current();
    setStepIndex(0);
  }, [settled]);

  const steps = sequence.steps;

  const animateDim = useCallback(
    (from: number, to: number, durationMs: number, onDone?: () => void) => {
      const startTime = performance.now();
      const frame = (now: number) => {
        const t = Math.min((now - startTime) / durationMs, 1);
        setDimProgress(from + (to - from) * t);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          onDone?.();
        }
      };
      rafRef.current = requestAnimationFrame(frame);
    },
    []
  );

  // 어두워짐 예약 — 직전 text step 표시 시작 시점 기준
  const scheduleDim = useCallback(
    (dim: DimStartStep, textDurationMs: number) => {
      if (reduced) {
        // 감속 모션: 마지막 문구 종료 시점에 최종 어둠 즉시 적용
        dimTimeoutRef.current = window.setTimeout(() => setDimProgress(1), textDurationMs);
        return;
      }
      dimTimeoutRef.current = window.setTimeout(() => {
        // 1단계: 살짝 어두워짐 → 2단계: 최종 어둠까지 선형 진행
        animateDim(0, dim.initialDimTarget, dim.initialDimDurationMs, () => {
          animateDim(dim.initialDimTarget, 1, dim.fullDimDurationMs);
        });
      }, dim.delayMs);
    },
    [reduced, animateDim]
  );

  // step 진행
  useEffect(() => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    const step = steps[stepIndex];
    // dimStart는 트리거 전용 step — 직전 text step 시작 시점에 이미 예약됨
    if (step.type === "dimStart") return;

    if (stepIndex === MEASUREMENT_START_STEP_INDEX) onMeasureStartRef.current();

    const next = steps[stepIndex + 1];
    if (next?.type === "dimStart") scheduleDim(next, step.durationMs);

    const t = window.setTimeout(() => setStepIndex((i) => i + 1), step.durationMs);
    return () => window.clearTimeout(t);
  }, [stepIndex, steps, scheduleDim]);

  // 확장 전 렌더 출력은 원본 사각형 위치. 확장 자체는 layout effect가 DOM 스타일로 수행하며,
  // React는 이 값이 바뀌지 않는 한 style을 다시 쓰지 않으므로 충돌하지 않는다.
  const boxStyle: CSSProperties =
    !settled && sourceRect
      ? {
          top: sourceRect.top,
          left: sourceRect.left,
          width: sourceRect.width,
          height: sourceRect.height,
          borderRadius: SOURCE_RADIUS,
        }
      : { top: 0, left: 0, width: "100vw", height: "100dvh", borderRadius: 0 };

  const currentStep = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const visibleStep =
    currentStep &&
    (currentStep.type === "setLabel" || currentStep.type === "count" || currentStep.type === "text")
      ? currentStep
      : null;

  return (
    <div
      ref={overlayRef}
      className="immersion-overlay fixed z-40 flex items-center justify-center overflow-hidden"
      style={{ ...boxStyle, "--immersion-expand-ms": `${EXPAND_MS}ms` } as CSSProperties}
    >
      {visibleStep && (
        <div
          key={stepIndex}
          className="immersion-intro-fade-in px-6 text-center text-[var(--immersion-bg)]"
          style={{ "--step-ms": `${visibleStep.durationMs}ms` } as CSSProperties}
        >
          <div className="immersion-intro-fade-out">
            {visibleStep.type === "setLabel" && (
              <span className="text-lg font-medium sm:text-xl">
                {strings.immersionIntro.setLabel(setNumber)}
              </span>
            )}
            {visibleStep.type === "count" && (
              <span className="text-7xl font-thin sm:text-8xl">{visibleStep.value}</span>
            )}
            {visibleStep.type === "text" && (
              <p className="mx-auto max-w-sm whitespace-pre-line text-xl leading-relaxed tracking-wide sm:text-2xl">
                {strings.immersionIntro[visibleStep.textKey]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
