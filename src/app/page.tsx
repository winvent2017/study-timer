"use client";

import { useRef, useState } from "react";
import { AppPhase, SessionSettings, SetRecord } from "@/types";
import { rollAlarmSilent } from "@/lib/messages";
import { useStopwatch } from "@/hooks/useStopwatch";
import { useSettingsStore } from "@/hooks/useSettingsStore";

import SetupScreen from "@/components/SetupScreen";
import StudyScreen from "@/components/StudyScreen";
import ImmersionMode from "@/components/ImmersionMode";
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

  const minReachedRef = useRef(false);

  const isUnlimited = settings.setCount === "unlimited";
  const isFinalSet = !isUnlimited && setsCompleted.length + 1 >= (settings.setCount as number);

  function handleTick(elapsedSeconds: number) {
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

  const isRunning = phase === "studying" || phase === "immersion";
  const { elapsedSeconds, reset } = useStopwatch(isRunning, handleTick);

  function startSession(newSettings: SessionSettings) {
    setSettings(newSettings);
    setSetsCompleted([]);
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

  return (
    <main>
      {phase === "setup" && (
        <SetupScreen key={JSON.stringify(settings)} initialSettings={settings} onStart={startSession} />
      )}

      {phase === "studying" && (
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

      {phase === "summary" && <SummaryScreen sets={setsCompleted} onRestart={handleRestart} />}

      {showGiveUp && <GiveUpModal onClose={handleGiveUpClose} />}
      {showAlarm && (
        <AlarmModal minMinutes={settings.minMinutes} onContinue={handleAlarmContinue} onRest={handleAlarmRest} />
      )}
      {phase === "celebration" && pendingRecord && (
        <CelebrationModal
          record={pendingRecord}
          isFinalSet={isFinalSet}
          onNextSet={handleNextSet}
          onRest={handleRestAfterCelebration}
          onViewSummary={handleViewSummary}
        />
      )}
    </main>
  );
}
