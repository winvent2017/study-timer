export interface SessionSettings {
  minMinutes: number;
  breakMinutes: number;
  setCount: number;
  silentProbability: number; // 0-100, chance the alarm does NOT ring
}

export const DEFAULT_SETTINGS: SessionSettings = {
  minMinutes: 5,
  breakMinutes: 15,
  setCount: 3,
  silentProbability: 40,
};

export interface SetRecord {
  targetMinutes: number;
  elapsedSeconds: number;
  multiplier: number;
}

export type AppPhase =
  | "setup"
  | "studying"
  | "immersion"
  | "celebration"
  | "break"
  | "summary";

export type ImmersionStepType = "darken" | "silence" | "number" | "text" | "fade";

export interface ImmersionStep {
  type: ImmersionStepType;
  content?: string; // number/text 단계에서 표시할 내용
  durationMs: number; // 이 단계의 총 지속 시간
  audioSrc?: string; // 향후 음성 낭독용 (이번 작업에서는 사용하지 않음, 필드만 존재)
}

export interface ImmersionSequence {
  id: string;
  name: string;
  steps: ImmersionStep[];
}
