// 향후 사용자 커스텀/유료 시퀀스 팩은 이 형태의 객체를 추가·교체하는 방식으로 확장한다.
// 재생 컴포넌트는 시퀀스 내용을 하드코딩하지 않는다.
import { ImmersionSequence } from "@/types";
import { strings } from "@/lib/strings/ko";

// 경과 시간(내부 측정, 화면 미표시) 측정 시작 기준 step 인덱스.
// 현재는 "자, 이제 시작합니다" text step의 표시 시작 시점.
export const MEASUREMENT_START_STEP_INDEX = 5;

export const DEFAULT_SEQUENCE: ImmersionSequence = {
  id: "default",
  name: strings.immersionSequences.defaultName,
  steps: [
    { type: "pause", durationMs: 500 },
    { type: "setLabel", durationMs: 1000 },
    { type: "count", value: 3, durationMs: 1000 },
    { type: "count", value: 2, durationMs: 1000 },
    { type: "count", value: 1, durationMs: 1000 },
    { type: "text", textKey: "start", durationMs: 2000 },
    { type: "text", textKey: "enter", durationMs: 3000 },
    { type: "text", textKey: "dimNotice", durationMs: 3000 },
    {
      type: "dimStart",
      delayMs: 500,
      initialDimTarget: 0.08,
      initialDimDurationMs: 400,
      fullDimDurationMs: 45000,
    },
  ],
};
