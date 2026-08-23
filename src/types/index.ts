export type SetCount = number | "unlimited";

export interface SessionSettings {
  minMinutes: number;
  breakMinutes: number;
  setCount: SetCount;
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
