export const GIVE_UP_MESSAGES = [
  "오늘은 여기까지! 시작한 것만으로도 충분해요 🌱",
  "다음엔 조금만 더 버텨볼까요? 이미 절반은 온 거예요.",
  "쉬어가는 것도 실력이에요. 잘했어요!",
  "완벽하지 않아도 괜찮아요. 오늘의 시도, 기록해둘게요.",
  "포기가 아니라 잠깐 멈춤이에요. 다시 만나요!",
  "여기까지 온 당신, 이미 어제보다 나아요.",
  "몸이 먼저 보내는 신호일 수도 있어요. 잘 들었어요.",
];

export function randomGiveUpMessage(): string {
  return GIVE_UP_MESSAGES[Math.floor(Math.random() * GIVE_UP_MESSAGES.length)];
}

export function rollAlarmSilent(silentProbability: number): boolean {
  const clamped = Math.min(100, Math.max(0, silentProbability));
  return Math.random() * 100 < clamped;
}

export function formatMultiplier(multiplier: number): string {
  return multiplier.toFixed(1).replace(/\.0$/, "") + "배";
}

export function celebrationLine(targetMinutes: number, elapsedSeconds: number, multiplier: number): string {
  const elapsedMinutes = Math.round(elapsedSeconds / 60);
  return `${targetMinutes}분만 하려 했는데 무려 ${elapsedMinutes}분! 목표의 ${formatMultiplier(multiplier)}를 해내셨어요 🎉`;
}
