# 프롬프트: 세트 완료 골드 그리드 (달성 시각화)

## 목적

세트를 완료할 때마다 SetCountGrid의 흐릿한 사각형이 하나씩 "골드바" 질감의 금빛으로 채워지도록 한다. 성취의 순간(축하 모달)에 방금 완료한 사각형이 팝 + 광택 스윕 애니메이션과 함께 채워지는 연출을 보여준다. 1시도(1세트) = 사각형 1개 완전 채움 원칙이며, 초과 달성 배수는 그리드에 표시하지 않는다.

## 변경 사항

### 1. 골드 색상 토큰 추가

- `src/app/globals.css`의 `:root`에 골드 CSS 변수 3종 추가:
  - `--gold-light: #ffe08a`
  - `--gold-mid: #f2b73f`
  - `--gold-dark: #d99a2b`
- 이후 모든 골드 스타일은 이 변수를 참조 (hex 하드코딩 금지)

### 2. SetCountGrid에 완료 상태 반영

**2-1. props 확장**

- `SetCountGrid`에 `completedCount?: number` prop 추가 (기본값 0)
- `justCompleted?: boolean` prop 추가 (기본값 false) — true이면 마지막 완료 사각형(인덱스 `completedCount - 1`)에 등장 애니메이션(아래 2-3) 적용

**2-2. 완료 사각형 스타일 (C3: 수직 금속바)**

- 인덱스가 `completedCount` 미만인 사각형은 다음 스타일 적용:
  - 배경: `linear-gradient(180deg, var(--gold-light) 0%, var(--gold-mid) 38%, var(--gold-dark) 100%)` — 위가 밝고 아래로 갈수록 진해지는 수직 그라데이션 (사선 없음)
  - 베벨: `box-shadow: inset 0 2px 3px rgba(255,255,255,.55), inset 0 -3px 4px rgba(140,90,10,.35), 0 2px 6px rgba(217,154,43,.35)`
- 미완료 사각형은 기존 흐릿한 스타일(`bg-[var(--accent)]/20`) 그대로 유지

**2-3. 완료 순간 애니메이션 (justCompleted 시 마지막 완료 셀에만)**

- **팝**: scale 0.85 → 1.06 → 1.0, 450ms, `cubic-bezier(.34,1.56,.64,1)`
- **광택 스윕**: `::after` 가상 요소(또는 absolute div)로 기울어진 흰색 띠를 만들어 왼쪽 밖에서 오른쪽 밖으로 1회 스치게 함
  - 띠: 너비 45%, `skewX(-18deg)`, `linear-gradient(100deg, transparent 0%, rgba(255,255,255,.75) 50%, transparent 100%)`
  - 애니메이션: left -60% → 130%, 0.9s ease-out, 0.15s delay, forwards (1회만, 반복 없음)
  - 부모 셀에 `overflow: hidden` 필요
- 이미 완료된 이전 사각형들은 애니메이션 없이 정적인 골드 상태로만 렌더링
- `prefers-reduced-motion: reduce` 환경에서는 팝/스윕 애니메이션 없이 즉시 골드 상태로 표시

### 3. 그리드 노출 위치

**3-1. SetupScreen (기존)**

- 변경 없음. `completedCount`를 넘기지 않으므로 전부 흐릿한 상태 (기존 동작 그대로)

**3-2. CelebrationModal (신규 — 주 무대)**

- 축하 문구 아래에 `SetCountGrid`를 컴팩트하게 표시
- props: `setCount` = 설정된 세트 수, `completedCount` = 이번 세트 포함 완료 수, `justCompleted = true`
- 필요 시 컴팩트 표시를 위해 `SetCountGrid`에 `compact?: boolean` prop 추가 가능 (셀 높이 축소, 요약 텍스트 숨김 등). 모달 폭을 고려해 판단
- 총 예상 시간 요약 텍스트("총 예상 시간: ...")는 축하 모달에서는 숨김 (설정 화면 전용 정보이므로)
- `page.tsx`에서 CelebrationModal로 `setCount`, `completedCount`(= `setsCompleted.length + 1`, pendingRecord 포함) 전달

**3-3. SummaryScreen (신규 — 최종 결과)**

- 세트별 기록 목록 위나 아래 적절한 위치에 최종 그리드 표시
- props: `completedCount` = `sets.length`, `justCompleted = false` (애니메이션 없음, 정적 골드)
- 요약 텍스트 숨김
- 참고: 유저가 설정한 세트 수보다 적게 완료하고 끝냈을 수 있음. `setCount`는 설정값을 그대로 사용해 미완료 칸은 흐릿하게 남김 (이게 자연스러운 "오늘의 결과" 표현)

**3-4. StudyScreen / ImmersionMode / BreakScreen**

- 그리드를 넣지 않음. 집중/휴식 화면은 현재의 조용한 상태 유지

## 구현 시 참고

- `page.tsx`의 기존 `setsCompleted` state를 완료 수 소스로 사용. 새로운 상태 추가 불필요
- CelebrationModal 표시 시점에는 `pendingRecord`가 아직 `setsCompleted`에 반영되기 전이므로 `completedCount = setsCompleted.length + 1`로 계산해 전달
- SummaryScreen은 `sets` prop을 이미 받고 있으므로 `sets.length` 사용. 단 `setCount`(설정값)를 추가로 넘겨야 함 — `page.tsx`에서 `settings.setCount` 전달
- 골드 스타일은 Tailwind 임의 값(`bg-[linear-gradient(...)]`) 대신 globals.css에 유틸리티 클래스(예: `.cell-gold`, `.cell-gold-shine`)로 정의하는 것을 권장 (그라데이션 + 다중 box-shadow가 길어서 JSX 가독성 저하 방지)
- 애니메이션 keyframes(`pop`, `shine`)도 globals.css에 정의
- 텍스트 하드코딩 금지 컨벤션(CLAUDE.md/AGENTS.md) 준수 — 이번 작업은 신규 화면 텍스트가 없어야 정상. 새 문구가 필요해지면 반드시 `strings/ko.ts`에 추가
- 기존 SetCountGrid의 증감 트랜지션(설정 화면 슬라이더 연동), 스크롤 페이드 로직은 건드리지 않음
- 배수(x2, x3 등) 표시, 스파클 파티클, 아이템 수집 시스템은 이번 범위에 포함하지 않음 (향후 별도 설계)

## 완료 후 확인 사항

- [ ] globals.css에 골드 CSS 변수 3종이 추가되었는지
- [ ] 설정 화면 그리드는 기존과 동일하게 전부 흐릿한 상태인지
- [ ] 세트 완료 → 축하 모달에서 그리드가 보이고, 이전 세트는 정적 골드, 방금 완료한 칸만 팝 + 광택 스윕이 1회 재생되는지
- [ ] 완료 사각형이 수직 그라데이션(위 밝음 → 아래 진함) + 베벨의 골드바 질감인지 (사선 없음)
- [ ] 광택 스윕이 반복되지 않고 등장 시 딱 1회만 스치는지
- [ ] 요약 화면에 최종 그리드가 정적으로 표시되고, 중도 종료 시 미완료 칸이 흐릿하게 남는지
- [ ] 축하 모달/요약 화면에서 "총 예상 시간" 텍스트가 숨겨지는지
- [ ] StudyScreen / ImmersionMode / BreakScreen에는 그리드가 없는지
- [ ] prefers-reduced-motion 환경에서 애니메이션 없이 즉시 골드로 표시되는지
- [ ] 기존 기능(슬라이더 연동 그리드 증감, 확률 로직, 몰입 모드 등)에 영향이 없는지
