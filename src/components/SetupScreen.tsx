"use client";

import { useState } from "react";
import { SessionSettings } from "@/types";

interface Props {
  initialSettings: SessionSettings;
  onStart: (settings: SessionSettings) => void;
}

export default function SetupScreen({ initialSettings, onStart }: Props) {
  const [settings, setSettings] = useState<SessionSettings>(initialSettings);
  const [unlimited, setUnlimited] = useState(initialSettings.setCount === "unlimited");

  function handleStart() {
    onStart(settings);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-5 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">몰입 서프라이즈 타이머</h1>
        <p className="mt-2 text-sm text-[var(--foreground)]/70">
          숫자와 시간 압박 없이, 불확실성으로 몰입을 유도해요.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-3xl bg-[var(--accent)]/10 p-5">
        <FieldSlider
          label="최소 학습시간"
          value={settings.minMinutes}
          unit="분"
          min={1}
          max={60}
          onChange={(v) => setSettings((s) => ({ ...s, minMinutes: v }))}
        />

        <FieldSlider
          label="휴식시간"
          value={settings.breakMinutes}
          unit="분"
          min={1}
          max={60}
          onChange={(v) => setSettings((s) => ({ ...s, breakMinutes: v }))}
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--foreground)]">세트 반복 횟수</label>
            <label className="flex items-center gap-1.5 text-xs text-[var(--foreground)]/70">
              <input
                type="checkbox"
                checked={unlimited}
                onChange={(e) => {
                  setUnlimited(e.target.checked);
                  setSettings((s) => ({
                    ...s,
                    setCount: e.target.checked ? "unlimited" : 3,
                  }));
                }}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              무제한
            </label>
          </div>
          {!unlimited && (
            <input
              type="number"
              min={1}
              max={20}
              value={typeof settings.setCount === "number" ? settings.setCount : 3}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  setCount: Math.max(1, Number(e.target.value) || 1),
                }))
              }
              className="w-full rounded-xl border border-[var(--accent)]/40 bg-[var(--background)] px-4 py-2 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
            />
          )}
        </div>

        <FieldSlider
          label="알람이 안 울릴 확률"
          value={settings.silentProbability}
          unit="%"
          min={0}
          max={100}
          onChange={(v) => setSettings((s) => ({ ...s, silentProbability: v }))}
        />
      </div>

      <p className="rounded-2xl bg-[var(--accent)]/15 px-4 py-3 text-center text-sm leading-relaxed text-[var(--foreground)]/80">
        이 타이머는 가끔 예정된 시간에 울리지 않을 수 있어요. 당신도 몰랐던 집중 잠재력을 끌어올리기 위한 장치입니다.
      </p>

      <button
        onClick={handleStart}
        className="w-full rounded-2xl bg-[var(--accent)] py-4 text-lg font-semibold text-white shadow-md transition active:scale-[0.98]"
      >
        시작하기
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
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
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
        className="w-full accent-[var(--accent)]"
      />
    </div>
  );
}
