import { strings } from "./strings/ko";

export function randomGiveUpMessage(): string {
  const messages = strings.giveUp.messages;
  return messages[Math.floor(Math.random() * messages.length)];
}

export function rollAlarmSilent(silentProbability: number): boolean {
  const clamped = Math.min(100, Math.max(0, silentProbability));
  return Math.random() * 100 < clamped;
}

export function formatMultiplier(multiplier: number): string {
  return multiplier.toFixed(1).replace(/\.0$/, "") + strings.celebration.multiplierUnit;
}

export function celebrationLine(targetMinutes: number, elapsedSeconds: number, multiplier: number): string {
  const elapsedMinutes = Math.round(elapsedSeconds / 60);
  return strings.celebration.lineTemplate(targetMinutes, elapsedMinutes, formatMultiplier(multiplier));
}
