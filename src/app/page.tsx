"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AppPhase, SessionSettings, SetRecord } from "@/types";
import { rollAlarmSilent } from "@/lib/messages";
import { useStopwatch } from "@/hooks/useStopwatch";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { VISUAL_ONLY_MODE } from "@/lib/config";
import { DEFAULT_SEQUENCE } from "@/lib/immersionSequences";

import Header from "@/components/Header";
import SetupScreen from "@/components/SetupScreen";
import StudyScreen from "@/components/StudyScreen";
import ImmersionMode from "@/components/ImmersionMode";
import ImmersionSession from "@/components/ImmersionSession";
import GiveUpModal from "@/components/GiveUpModal";
import AlarmModal from "@/components/AlarmModal";
import CelebrationModal from "@/components/CelebrationModal";
import BreakScreen from "@/components/BreakScreen";
import SummaryScreen from "@/components/SummaryScreen";

const DARKEN_MS = DEFAULT_SEQUENCE.steps.find((step) => step.type === "darken")?.durationMs ?? 0;
const BG_EXIT_MS = 400;

export default function Home() {
  const [settings, setSettings] = useSettingsStore();
  const [phase, setPhase] = useState<AppPhase>("setup");
  const [setsCompleted, setSetsCompleted] = useState<SetRecord[]>([]);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [pendingRecord, setPendingRecord] = useState<SetRecord | null>(null);
  const [setupExiting, setSetupExiting] = useState(false);
  const [immersionBgActive, setImmersionBgActive] = useState(false);
  const [bgTransitionMs, setBgTransitionMs] = useState(BG_EXIT_MS);
  const [immersionPaused, setImmersionPaused] = useState(false);

  const minReachedRef = useRef(false);

  const isFinalSet = setsCompleted.length + 1 >= settings.setCount;

  function handleTick(elapsedSeconds: number) {
    if (VISUAL_ONLY_MODE) return;
    if (phase !== "studying") return;
    if (minReachedRef.current) return;
    if (elapsedSeconds >= settings.minMinutes * 60) {
      minReachedRef.current = true;
      const silent = rollAlarmSilent(settings.silentProbability);
      if (silent) {
        setPhase("immersion");
      } else {
        setShowAlarm(true);
      }
    }
  }

  const isRunning = (phase === "studying" || phase === "immersion") && !immersionPaused;
  const { elapsedSeconds, reset } = useStopwatch(isRunning, handleTick);

  function startSession(newSettings: SessionSettings) {
    setSetsCompleted([]);

    if (VISUAL_ONLY_MODE) {
      setImmersionBgActive(true);
      setBgTransitionMs(DARKEN_MS);
      setSetupExiting(true);
      window.setTimeout(() => {
        setSettings(newSettings);
        setSetupExiting(false);
      }, DARKEN_MS);
      beginSet();
      return;
    }

    setSettings(newSettings);
    beginSet();
  }

  function beginSet() {
    minReachedRef.current = false;
    reset();
    setPhase("studying");
  }

  function handleGiveUp() {
    setShowGiveUp(true);
  }

  function handleGiveUpClose() {
    setShowGiveUp(false);
    setSetsCompleted([]);
    setPhase("setup");
  }

  function handleAlarmContinue() {
    setShowAlarm(false);
    setPhase("immersion");
  }

  function handleAlarmRest() {
    setShowAlarm(false);
    finishSet();
  }

  function finishSet() {
    const targetSeconds = settings.minMinutes * 60;
    const record: SetRecord = {
      targetMinutes: settings.minMinutes,
      elapsedSeconds,
      multiplier: elapsedSeconds / targetSeconds,
    };
    setPendingRecord(record);
    setPhase("celebration");
  }

  function handleNextSet() {
    if (!pendingRecord) return;
    setSetsCompleted((prev) => [...prev, pendingRecord]);
    setPendingRecord(null);
    beginSet();
  }

  function handleRestAfterCelebration() {
    if (!pendingRecord) return;
    setSetsCompleted((prev) => [...prev, pendingRecord]);
    setPendingRecord(null);
    setPhase("break");
  }

  function handleViewSummary() {
    if (pendingRecord) {
      setSetsCompleted((prev) => [...prev, pendingRecord]);
      setPendingRecord(null);
    }
    setPhase("summary");
  }

  function handleBreakStartNext() {
    beginSet();
  }

  function handleRestart() {
    setSetsCompleted([]);
    setPendingRecord(null);
    setPhase("setup");
  }

  // TODO: 최소 목표시간 달성/미달성에 따른 분기 반응 설계 예정
  function handleStopSession() {
    setImmersionPaused(false);
    setBgTransitionMs(BG_EXIT_MS);
    setImmersionBgActive(false);
    setSetsCompleted([]);
    setPendingRecord(null);
    setPhase("setup");
  }

  function handleImmersionDialogOpen() {
    setImmersionPaused(true);
  }

  function handleImmersionDialogResume() {
    setImmersionPaused(false);
  }

  const showHeader = phase === "setup" || phase === "summary";
  const showSetup = phase === "setup" || setupExiting;

  return (
    <main
      className="main-bg-transition"
      style={
        {
          backgroundColor: immersionBgActive ? "var(--immersion-bg)" : "var(--background)",
          "--bg-transition-ms": `${bgTransitionMs}ms`,
        } as CSSProperties
      }
    >
      {showHeader && <Header />}

      {showSetup && (
        <div
          className={`setup-exit-transition ${setupExiting ? "opacity-0" : "opacity-100"}`}
          style={{ "--setup-exit-ms": `${DARKEN_MS}ms` } as CSSProperties}
        >
          <SetupScreen key={JSON.stringify(settings)} initialSettings={settings} onStart={startSession} />
        </div>
      )}

      {phase === "studying" &&
        (VISUAL_ONLY_MODE ? (
          <ImmersionSession
            sequence={DEFAULT_SEQUENCE}
            onStopSession={handleStopSession}
            onDialogOpen={handleImmersionDialogOpen}
            onDialogResume={handleImmersionDialogResume}
          />
        ) : (
          <StudyScreen minMinutes={settings.minMinutes} elapsedSeconds={elapsedSeconds} onGiveUp={handleGiveUp} />
        ))}

      {phase === "immersion" && <ImmersionMode onStop={finishSet} />}

      {phase === "break" && (
        <BreakScreen
          breakMinutes={settings.breakMinutes}
          onStartNext={handleBreakStartNext}
          onViewSummary={() => setPhase("summary")}
        />
      )}

      {phase === "summary" && (
        <SummaryScreen sets={setsCompleted} setCount={settings.setCount} onRestart={handleRestart} />
      )}

      {showGiveUp && <GiveUpModal onClose={handleGiveUpClose} />}
      {showAlarm && (
        <AlarmModal minMinutes={settings.minMinutes} onContinue={handleAlarmContinue} onRest={handleAlarmRest} />
      )}
      {phase === "celebration" && pendingRecord && (
        <CelebrationModal
          record={pendingRecord}
          isFinalSet={isFinalSet}
          setCount={settings.setCount}
          completedCount={setsCompleted.length + 1}
          onNextSet={handleNextSet}
          onRest={handleRestAfterCelebration}
          onViewSummary={handleViewSummary}
        />
      )}
    </main>
  );
}
