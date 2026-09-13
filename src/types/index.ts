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

// 용어: 세트(set) = 학습+휴식 한 묶음(그리드 사각형 하나), 세션(session) = 목표로 정한 세트 전체 묶음.
// "현재 세트 순번"은 세션 내에서 지금 시작하는 세트의 1-based 번호.

export type ImmersionIntroTextKey = "start" | "enter" | "dimNotice";

// audioSrc: 향후 음성 낭독용 (재생 로직은 미구현, 필드만 존재)
export type ImmersionStep =
  | { type: "pause"; durationMs: number; audioSrc?: string } // 정적
  | { type: "setLabel"; durationMs: number; audioSrc?: string } // 현재 세트 순번 표시
  | { type: "count"; value: number; durationMs: number; audioSrc?: string } // 카운트 숫자
  | { type: "text"; textKey: ImmersionIntroTextKey; durationMs: number; audioSrc?: string } // strings 키 참조 문구
  | {
      // 어두워짐 시작 트리거 — 직전 text step 표시 시작 후 delayMs에 발동
      type: "dimStart";
      delayMs: number;
      initialDimTarget: number; // 1단계에서 도달할 진행도 p
      initialDimDurationMs: number; // 1단계(살짝 어두워짐) 소요 시간
      fullDimDurationMs: number; // 2단계(p → 1.0) 소요 시간
      audioSrc?: string;
    };

export interface ImmersionSequence {
  id: string;
  name: string;
  steps: ImmersionStep[];
}
