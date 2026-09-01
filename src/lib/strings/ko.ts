export const strings = {
  header: {
    logo: "EasyDeeper",
    login: "로그인",
    signup: "회원가입",
  },
  setup: {
    title: "몰입 서프라이즈 타이머",
    subtitle: "숫자와 시간 압박 없이, 불확실성으로 몰입을 유도해요.",
    minStudyTimeLabel: "1세트 최소 학습시간",
    breakTimeLabel: "휴식시간",
    setCountLabel: "세트 반복 횟수",
    silentProbabilityLabel: "알람이 안 울릴 확률",
    minuteUnit: "분",
    percentUnit: "%",
    setCountUnit: "회",
    totalTimeSummary: (minMinutes: number, setCount: number, total: number) =>
      `총 예상 시간: ${minMinutes}분 × ${setCount}세트 = ${total}분`,
    notice:
      "이 타이머는 가끔 예정된 시간에 울리지 않을 수 있어요. 당신도 몰랐던 집중 잠재력을 끌어올리기 위한 장치입니다.",
    startButton: "시작하기",
  },
  study: {
    focusingMessage: "집중하는 중이에요",
    minTimeMessage: (minMinutes: number) => `최소 ${minMinutes}분까지는 함께 버텨봐요`,
    giveUpButton: "포기",
  },
  immersion: {
    title: "열공 중...",
    subtitle: "지금은 시간 대신 몰입에만 집중해봐요",
    stopButton: "그만하기",
  },
  alarm: {
    timeUpMessage: (minMinutes: number) => `${minMinutes}분 다 됐어요! 더 할까요, 쉴까요?`,
    restButton: "쉬기",
    continueButton: "더 하기",
  },
  giveUp: {
    messages: [
      "오늘은 여기까지! 시작한 것만으로도 충분해요 🌱",
      "다음엔 조금만 더 버텨볼까요? 이미 절반은 온 거예요.",
      "쉬어가는 것도 실력이에요. 잘했어요!",
      "완벽하지 않아도 괜찮아요. 오늘의 시도, 기록해둘게요.",
      "포기가 아니라 잠깐 멈춤이에요. 다시 만나요!",
      "여기까지 온 당신, 이미 어제보다 나아요.",
      "몸이 먼저 보내는 신호일 수도 있어요. 잘 들었어요.",
    ],
    backToStartButton: "처음으로 돌아가기",
  },
  celebration: {
    multiplierUnit: "배",
    lineTemplate: (targetMinutes: number, elapsedMinutes: number, multiplierText: string) =>
      `${targetMinutes}분만 하려 했는데 무려 ${elapsedMinutes}분! 목표의 ${multiplierText}를 해내셨어요 🎉`,
    viewSummaryButton: "오늘의 요약 보기",
    restButton: "휴식하기",
    nextSetButton: "다음 세트로",
    stopAndViewSummaryButton: "오늘은 여기까지, 요약 보기",
  },
  break: {
    restingMessage: "휴식 중이에요 ☕",
    startNextQuestion: "다음 세트를 시작할까요?",
    stopForTodayButton: "오늘은 그만",
    startButton: "시작하기",
    restEyesMessage: "잠시 눈을 쉬어가요",
  },
  immersionSession: {
    introLine: "자, 이제 당신은 천천히 몰입의 세계에 빠지게 됩니다",
    pauseButtonLabel: "일시정지",
  },
  pauseDialog: {
    question: "잠시 멈춰볼까요?",
    continueButton: "조금만 더 해볼래요",
    stopButton: "여기까지 할게요",
  },
  immersionSequences: {
    defaultName: "기본 시퀀스",
  },
  summary: {
    title: "오늘의 요약",
    totalFocusTimeLabel: "총 몰입시간",
    totalMinutesText: (minutes: number) => `${minutes}분`,
    bestRecordLabel: "최고 기록",
    bestRecordText: (multiplierText: string) => `목표의 ${multiplierText}`,
    setRecordsLabel: "세트별 기록",
    setLabel: (index: number) => `세트 ${index}`,
    setDetailText: (targetMinutes: number, actualMinutes: number) =>
      `목표 ${targetMinutes}분 → 실제 ${actualMinutes}분`,
    restartButton: "처음으로",
  },
} as const;
