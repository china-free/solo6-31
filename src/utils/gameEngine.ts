import type { Country } from "@/data/countries";
import { COUNTRIES, shuffleArray } from "@/data/countries";

export type MatchResult = "correct" | "wrong" | "pending";

export interface RoundData {
  countries: Country[];
  shuffledFlags: Country[];
}

export interface MatchRecord {
  flagCode: string;
  result: MatchResult;
}

export interface GameStats {
  correctCount: number;
  totalAttempts: number;
  accuracy: number;
  timeElapsed: number;
}

export interface Rating {
  emoji: string;
  text: string;
  color: string;
}

export function createRound(count: number = 5): RoundData {
  const countries = shuffleArray(COUNTRIES).slice(0, count);
  return {
    countries,
    shuffledFlags: shuffleArray(countries),
  };
}

export function checkMatch(countryCode: string, flagCode: string): boolean {
  return countryCode === flagCode;
}

export function isRoundComplete(
  matches: Record<string, MatchRecord | null>,
  totalSlots: number
): boolean {
  return Object.values(matches).filter((m) => m !== null).length === totalSlots;
}

export function deriveStats(
  matches: Record<string, MatchRecord | null>,
  timeElapsed: number
): GameStats {
  const records = Object.values(matches).filter((m): m is MatchRecord => m !== null);
  const correctCount = records.filter((m) => m.result === "correct").length;
  const totalAttempts = records.length;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
  return { correctCount, totalAttempts, accuracy, timeElapsed };
}

export function getFlagMatchState(
  flagCode: string,
  matches: Record<string, MatchRecord | null>,
  wrongFlags: Set<string>
): { isMatched: boolean; isCorrect: boolean; isWrong: boolean } {
  const matchedAs = Object.entries(matches).find(
    ([, m]) => m !== null && m.flagCode === flagCode
  );
  const isMatched = matchedAs != null;
  const isCorrect = matchedAs != null && matchedAs[1].result === "correct";
  const isWrong = wrongFlags.has(flagCode);
  return { isMatched, isCorrect, isWrong };
}

export function formatTimeDisplay(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatTimeReadable(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}分${secs}秒`;
  return `${secs}秒`;
}

export function getRating(accuracy: number, time: number): Rating {
  if (accuracy === 100 && time < 15) {
    return { emoji: "🏆", text: "地理大师！", color: "from-amber-400 to-yellow-500" };
  }
  if (accuracy === 100) {
    return { emoji: "⭐", text: "完美表现！", color: "from-emerald-400 to-teal-500" };
  }
  if (accuracy >= 80) {
    return { emoji: "🎯", text: "非常棒！", color: "from-sky-400 to-blue-500" };
  }
  if (accuracy >= 60) {
    return { emoji: "👍", text: "做得不错！", color: "from-indigo-400 to-violet-500" };
  }
  return { emoji: "💪", text: "继续加油！", color: "from-rose-400 to-pink-500" };
}

export function buildInitialMatches(
  countries: Country[]
): Record<string, MatchRecord | null> {
  return countries.reduce(
    (acc, c) => ({ ...acc, [c.code]: null }),
    {} as Record<string, MatchRecord | null>
  );
}
