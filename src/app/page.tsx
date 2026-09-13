"use client";

import { useRef, useState } from "react";
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
import ImmersionOverlay, { SourceRect } from "@/components/ImmersionOverlay";
import GiveUpModal from "@/components/GiveUpModal";
import AlarmModal from "@/components/AlarmModal";
import CelebrationModal from "@/components/CelebrationModal";
import BreakScreen from "@/components/BreakScreen";
import SummaryScreen from "@/components/SummaryScreen";

export default function Home() {
  const [settings, setSettings] = useSettingsStore();
  const [phase, setPhase] = useState<AppPhase>("setup");
  const [setsCompleted, setSetsCompleted] = useState<SetRecord[]>([]);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [pendingRecord, setPendingRecord] = useState<SetRecord | null>(null);

  // VISUAL_ONLY_MODE 몰입 도입 연출 상태
  const [immersionActive, setImmersionActive] = useState(false);
  const [immersionExpanded, setImmersionExpanded] = useState(false);
  const [sourceRect, setSourceRect] = useState<SourceRect | null>(null);
  const [measuring, setMeasuring] = useState(false);

  const minReachedRef = useRef(false);

  const isFinalSet = setsCompleted.length + 1 >= settings.setCount;
  const currentSetNumber = setsCompleted.length + 1;

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

  const isRunning = VISUAL_ONLY_MODE ? measuring : phase === "studying" || phase === "immersion";
  const { elapsedSeconds, reset } = useStopwatch(isRunning, handleTick);

  function startSession(newSettings: SessionSettings, rect: SourceRect | null) {
    setSetsCompleted([]);
    setSettings(newSettings);

    if (VISUAL_ONLY_MODE) {
      setSourceRect(rect);
      setImmersionActive(true);
      return;
    }

    beginSet();
  }

  // 도입 시퀀스가 측정 시작 step에 도달하면 경과 시간(내부 측정) 시작
  function handleMeasureStart() {
    reset();
    setMeasuring(true);
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

  // TODO: 중단하기 클릭 후 반응(최소 목표시간 달성/미달성 분기 등)은 별도 설계 예정 — 현재는 임시로 설정 화면 복귀
  function handleStopImmersion() {
    setImmersionActive(false);
    setImmersionExpanded(false);
    setSourceRect(null);
    setMeasuring(false);
    reset();
  }

  const showHeader = phase === "setup" || phase === "summary";

  return (
    <main>
      {showHeader && <Header />}

      {phase === "setup" && (
        <SetupScreen
          key={JSON.stringify(settings)}
          initialSettings={settings}
          currentSetNumber={currentSetNumber}
          immersionActive={immersionActive}
          showStopLabel={immersionExpanded}
          onStart={startSession}
          onStopImmersion={handleStopImmersion}
        />
      )}

      {immersionActive && (
        <ImmersionOverlay
          sequence={DEFAULT_SEQUENCE}
          sourceRect={sourceRect}
          setNumber={currentSetNumber}
          onExpandComplete={() => setImmersionExpanded(true)}
          onMeasureStart={handleMeasureStart}
        />
      )}

      {phase === "studying" && !VISUAL_ONLY_MODE && (
        <StudyScreen minMinutes={settings.minMinutes} elapsedSeconds={elapsedSeconds} onGiveUp={handleGiveUp} />
      )}

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
