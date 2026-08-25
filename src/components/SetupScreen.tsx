"use client";

import { useState } from "react";
import { SessionSettings } from "@/types";
import { strings } from "@/lib/strings/ko";
import SetCountGrid from "@/components/SetCountGrid";

interface Props {
  initialSettings: SessionSettings;
  onStart: (settings: SessionSettings) => void;
}

export default function SetupScreen({ initialSettings, onStart }: Props) {
  const [settings, setSettings] = useState<SessionSettings>(initialSettings);
  const [committedSetCount, setCommittedSetCount] = useState(initialSettings.setCount);

  function handleStart() {
    onStart(settings);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-5 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{strings.setup.title}</h1>
        <p className="mt-2 text-sm text-[var(--foreground)]/70">
          {strings.setup.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-3xl bg-[var(--accent)]/10 p-5">
        <FieldSlider
          label={strings.setup.minStudyTimeLabel}
          value={settings.minMinutes}
          unit={strings.setup.minuteUnit}
          min={1}
          max={60}
          onChange={(v) => setSettings((s) => ({ ...s, minMinutes: v }))}
        />

        <div>
          <FieldSlider
            label={strings.setup.setCountLabel}
            value={settings.setCount}
            unit={strings.setup.setCountUnit}
            min={1}
            max={20}
            onChange={(v) => setSettings((s) => ({ ...s, setCount: v }))}
            onCommit={setCommittedSetCount}
          />
          <SetCountGrid setCount={committedSetCount} minMinutes={settings.minMinutes} />
        </div>

        <FieldSlider
          label={strings.setup.breakTimeLabel}
          value={settings.breakMinutes}
          unit={strings.setup.minuteUnit}
          min={1}
          max={60}
          onChange={(v) => setSettings((s) => ({ ...s, breakMinutes: v }))}
        />

        <FieldSlider
          label={strings.setup.silentProbabilityLabel}
          value={settings.silentProbability}
          unit={strings.setup.percentUnit}
          min={0}
          max={100}
          onChange={(v) => setSettings((s) => ({ ...s, silentProbability: v }))}
        />
      </div>

      <p className="rounded-2xl bg-[var(--accent)]/15 px-4 py-3 text-center text-sm leading-relaxed text-[var(--foreground)]/80">
        {strings.setup.notice}
      </p>

      <button
        onClick={handleStart}
        className="w-full rounded-2xl bg-[var(--accent)] py-4 text-lg font-semibold text-white shadow-md transition active:scale-[0.98]"
      >
        {strings.setup.startButton}
      </button>
    </div>
  );
}

function FieldSlider({
  label,
  value,
  unit,
  min,
  max,
  onChange,
  onCommit,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
  onCommit?: (v: number) => void;
}) {
  function commit(e: { currentTarget: HTMLInputElement }) {
    onCommit?.(Number(e.currentTarget.value));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--foreground)]">{label}</label>
        <span className="text-sm font-semibold text-[var(--accent)]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseUp={commit}
        onTouchEnd={commit}
        onKeyUp={commit}
        className="w-full accent-[var(--accent)]"
      />
    </div>
  );
}
