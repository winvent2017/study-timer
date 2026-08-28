// 향후 사용자 커스텀/유료 시퀀스 팩은 이 형태의 객체를 추가·교체하는 방식으로 확장한다.
// 재생 컴포넌트는 시퀀스 내용을 하드코딩하지 않는다.
import { ImmersionSequence } from "@/types";
import { strings } from "@/lib/strings/ko";

export const DEFAULT_SEQUENCE: ImmersionSequence = {
  id: "default",
  name: strings.immersionSequences.defaultName,
  steps: [
    { type: "darken", durationMs: 2000 },
    { type: "silence", durationMs: 500 },
    { type: "number", content: "3", durationMs: 1200 },
    { type: "number", content: "2", durationMs: 1200 },
    { type: "number", content: "1", durationMs: 1200 },
    { type: "number", content: "0", durationMs: 1200 },
    { type: "text", content: strings.immersionSession.introLine, durationMs: 3500 },
    { type: "fade", durationMs: 1000 },
  ],
};
