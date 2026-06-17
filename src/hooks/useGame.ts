import { useReducer, useEffect, useCallback, useRef, useMemo } from "react";
import type { Country } from "@/data/countries";
import {
  createRound,
  checkMatch,
  isRoundComplete,
  deriveStats,
  getFlagMatchState,
  buildInitialMatches,
  type MatchRecord,
} from "@/utils/gameEngine";

const ROUND_SIZE = 5;
const WRONG_FEEDBACK_MS = 900;
const COMPLETE_DELAY_MS = 600;

interface GameState {
  phase: "idle" | "playing" | "finished";
  countries: Country[];
  shuffledFlags: Country[];
  matches: Record<string, MatchRecord | null>;
  wrongFlags: Set<string>;
  timeElapsed: number;
  roundSize: number;
}

type GameAction =
  | { type: "START_ROUND" }
  | { type: "DROP_FLAG"; countryCode: string; flagCode: string }
  | { type: "CLEAR_WRONG"; countryCode: string; flagCode: string }
  | { type: "FINISH_ROUND" }
  | { type: "TICK" };

function initRound(): GameState {
  const { countries, shuffledFlags } = createRound(ROUND_SIZE);
  return {
    phase: "idle",
    countries,
    shuffledFlags,
    matches: buildInitialMatches(countries),
    wrongFlags: new Set(),
    timeElapsed: 0,
    roundSize: countries.length,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_ROUND":
      return initRound();

    case "DROP_FLAG": {
      const { countryCode, flagCode } = action;
      if (state.matches[countryCode] !== null || state.phase === "finished") {
        return state;
      }

      const isCorrect = checkMatch(countryCode, flagCode);
      const newPhase = state.phase === "idle" ? "playing" : state.phase;

      if (isCorrect) {
        const newMatches = {
          ...state.matches,
          [countryCode]: { flagCode, result: "correct" as const },
        };
        const newWrongFlags = new Set(state.wrongFlags);
        newWrongFlags.delete(flagCode);

        return {
          ...state,
          phase: newPhase,
          matches: newMatches,
          wrongFlags: newWrongFlags,
        };
      }

      return {
        ...state,
        phase: newPhase,
        matches: {
          ...state.matches,
          [countryCode]: { flagCode, result: "wrong" as const },
        },
        wrongFlags: new Set(state.wrongFlags).add(flagCode),
      };
    }

    case "CLEAR_WRONG": {
      const { countryCode, flagCode } = action;
      const current = state.matches[countryCode];
      if (!current || current.result !== "wrong" || current.flagCode !== flagCode) {
        return state;
      }
      const newWrongFlags = new Set(state.wrongFlags);
      newWrongFlags.delete(flagCode);
      return {
        ...state,
        matches: { ...state.matches, [countryCode]: null },
        wrongFlags: newWrongFlags,
      };
    }

    case "FINISH_ROUND":
      return { ...state, phase: "finished" };

    case "TICK":
      return { ...state, timeElapsed: state.timeElapsed + 1 };

    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initRound);
  const timerRef = useRef<number | null>(null);
  const wrongTimerRefs = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      wrongTimerRefs.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (state.phase === "playing") {
      timerRef.current = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase]);

  useEffect(() => {
    if (
      state.phase === "playing" &&
      isRoundComplete(state.matches, state.roundSize)
    ) {
      const timer = setTimeout(() => dispatch({ type: "FINISH_ROUND" }), COMPLETE_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [state.matches, state.phase, state.roundSize]);

  const handleDrop = useCallback(
    (countryCode: string, flagCode: string) => {
      dispatch({ type: "DROP_FLAG", countryCode, flagCode });

      if (!checkMatch(countryCode, flagCode)) {
        const key = `${countryCode}:${flagCode}`;
        if (wrongTimerRefs.current.has(key)) {
          clearTimeout(wrongTimerRefs.current.get(key)!);
        }
        const timer = window.setTimeout(() => {
          dispatch({ type: "CLEAR_WRONG", countryCode, flagCode });
          wrongTimerRefs.current.delete(key);
        }, WRONG_FEEDBACK_MS);
        wrongTimerRefs.current.set(key, timer);
      }
    },
    []
  );

  const startGame = useCallback(() => {
    wrongTimerRefs.current.forEach((id) => clearTimeout(id));
    wrongTimerRefs.current.clear();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    dispatch({ type: "START_ROUND" });
  }, []);

  const stats = useMemo(
    () => deriveStats(state.matches, state.timeElapsed),
    [state.matches, state.timeElapsed]
  );

  const getFlagState = useCallback(
    (flagCode: string) => getFlagMatchState(flagCode, state.matches, state.wrongFlags),
    [state.matches, state.wrongFlags]
  );

  const getCountryStatus = useCallback(
    (countryCode: string) => {
      const record = state.matches[countryCode];
      if (!record) return { isCorrect: false, isWrong: false, matchedFlagCode: null };
      return {
        isCorrect: record.result === "correct",
        isWrong: record.result === "wrong",
        matchedFlagCode: record.result === "correct" ? record.flagCode : null,
      };
    },
    [state.matches]
  );

  return {
    countries: state.countries,
    shuffledFlags: state.shuffledFlags,
    phase: state.phase,
    timeElapsed: state.timeElapsed,
    roundSize: state.roundSize,
    stats,
    handleDrop,
    startGame,
    getFlagState,
    getCountryStatus,
  };
}
