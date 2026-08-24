# 작업 요청: 텍스트 문자열 중앙화 리팩토링 (다국어 준비)

## 배경

EasyDeeper는 향후 한/일/영/스페인어 다국어 지원을 계획하고 있습니다(3단계 예정). 지금 단계에서 실제 다국어 시스템을 구축하지는 않지만, **화면에 보이는 모든 한국어 텍스트를 컴포넌트 코드에서 분리해 별도 파일로 모아두는 작업**을 지금 미리 해두려고 합니다. 이렇게 해두면 나중에 언어별 파일만 추가하면 되고, 컴포넌트 코드는 거의 건드릴 필요가 없어집니다.

**이번 작업은 순수 리팩토링입니다. 기능/동작/디자인은 절대 변경하지 않고, 텍스트가 저장되는 위치만 바꿉니다.**

## 요구사항

### 1. 문자열 파일 생성

- `src/lib/strings/ko.ts` 파일을 새로 생성 (폴더 구조로 만들어, 나중에 `en.ts`, `ja.ts`, `es.ts`를 같은 위치에 추가하기 쉽게 함)
- 화면/컴포넌트 단위로 중첩 객체 구조 사용:

```typescript
export const strings = {
  header: {
    logo: "EasyDeeper",
    login: "로그인",
    signup: "회원가입",
  },
  setup: {
    title: "...",
    minStudyTimeLabel: "최소 학습시간",
    // ...
  },
  study: {
    // StudyScreen 관련 텍스트
  },
  immersion: {
    // ImmersionMode 관련 텍스트
  },
  alarm: {
    // AlarmModal 관련 텍스트
  },
  giveUp: {
    // GiveUpModal 관련 텍스트, 격려 멘트 배열 포함
  },
  celebration: {
    // CelebrationModal 관련 텍스트, 배수 축하 문구 템플릿
  },
  break: {
    // BreakScreen 관련 텍스트
  },
  summary: {
    // SummaryScreen 관련 텍스트
  },
} as const;
```

### 2. 대상 파일 (하드코딩된 한국어 텍스트를 찾아서 이동)

아래 파일들을 전수 조사해서, JSX 안에 직접 쓰인 한국어 문자열과 `lib/messages.ts`의 문구들을 모두 위 `strings/ko.ts`로 이동:

- `src/components/SetupScreen.tsx`
- `src/components/StudyScreen.tsx`
- `src/components/ImmersionMode.tsx`
- `src/components/AlarmModal.tsx`
- `src/components/GiveUpModal.tsx`
- `src/components/CelebrationModal.tsx`
- `src/components/BreakScreen.tsx`
- `src/components/SummaryScreen.tsx`
- `src/components/Modal.tsx`
- `src/lib/messages.ts` (격려 멘트, 확률 판정 관련 문구, 축하 문구 생성 로직)
- 새로 추가된 `src/components/Header.tsx`

### 3. 동적 문구(템플릿) 처리 방식

`messages.ts`의 `celebrationLine` 같은 함수는 "목표의 O배! 축하합니다"처럼 숫자가 문장 중간에 들어가는 템플릿입니다. 이런 경우:

- 텍스트 템플릿 자체(placeholder 포함)는 `strings/ko.ts`에 함수 형태로 저장
  ```typescript
  celebration: {
    multiplierLine: (multiplier: number) => `목표의 ${multiplier}배! 축하합니다`,
  }
  ```
- `messages.ts`는 로직(확률 계산, 랜덤 선택 등)만 남기고, 실제 출력 문자열은 `strings/ko.ts`를 참조하도록 수정
- 격려 멘트처럼 여러 개 중 랜덤으로 뽑는 배열도 `strings/ko.ts`에 배열로 저장하고, `messages.ts`는 그 배열에서 랜덤 인덱스만 뽑는 역할로 축소

### 4. 컴포넌트 수정 방식

각 컴포넌트 상단에서 필요한 부분만 import:

```typescript
import { strings } from "@/lib/strings/ko";
// ...
<button>{strings.header.login}</button>
```

### 5. 제외 대상 (건드리지 않을 것)

- 콘솔 로그, 주석, 변수명, 함수명 등 화면에 노출되지 않는 텍스트는 그대로 둠
- 숫자, 단위 표시 로직(`format.ts`)은 이번 범위에서 제외 (별도 작업으로 분리)

## 완료 후 확인 요청

1. `strings/ko.ts` 이외의 곳에 하드코딩된 한국어 문자열이 남아있지 않은지 전체 grep으로 재확인
2. 리팩토링 전후로 화면 텍스트가 토씨 하나 다르지 않고 동일한지 (문구 변경 없이 위치만 이동했는지)
3. 기존 기능(확률 알람, 몰입 모드, 축하 연출 등)이 전과 동일하게 동작하는지
4. TypeScript 타입 에러 없는지
