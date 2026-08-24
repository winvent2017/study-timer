<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 프로젝트 컨벤션: 화면 텍스트 중앙화 (다국어 준비)

화면에 노출되는 모든 텍스트(버튼 라벨, 안내 문구, 모달 메시지, 격려 멘트, 축하 문구, 에러 메시지 등)는 컴포넌트(JSX) 안에 직접 하드코딩하지 않는다. 반드시 `src/lib/strings/ko.ts`에 화면/컴포넌트 단위로 중첩된 객체 구조로 추가하고, 컴포넌트에서는 `import { strings } from "@/lib/strings/ko"` 형태로 참조한다.

- 숫자 등 동적 값이 포함된 문구는 `(param) => \`...\`` 형태의 함수로 `strings/ko.ts`에 저장한다.
- 여러 개 중 랜덤으로 선택되는 문구(격려 멘트 등)도 배열 형태로 `strings/ko.ts`에 저장하고, 로직 파일(`messages.ts` 등)은 선택/계산 로직만 담당한다.
- 목적: 향후 다국어(en/ja/es) 지원 시 `strings/en.ts` 등 언어별 파일만 추가하면 되고, 컴포넌트 코드는 수정할 필요가 없도록 하기 위함이다.
- 예외: 콘솔 로그, 코드 주석, 변수/함수명 등 화면에 노출되지 않는 텍스트는 대상이 아니다.
