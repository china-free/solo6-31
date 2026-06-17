import { useState, useEffect, useCallback, useRef } from "react";
import GameHeader from "@/components/GameHeader";
import FlagCard from "@/components/FlagCard";
import CountryTarget from "@/components/CountryTarget";
import ResultModal from "@/components/ResultModal";
import {
  selectRandomCountries,
  shuffleArray,
  type Country,
} from "@/data/countries";

type MatchStatus = "pending" | "correct" | "wrong";

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [shuffledFlags, setShuffledFlags] = useState<Country[]>([]);
  const [matches, setMatches] = useState<Record<string, string | null>>({});
  const [matchStatus, setMatchStatus] = useState<
    Record<string, MatchStatus>
  >({});
  const [wrongFlags, setWrongFlags] = useState<Set<string>>(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [draggingFlag, setDraggingFlag] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  const startGame = useCallback(() => {
    const countries = selectRandomCountries(5);
    const flags = shuffleArray(countries);

    setSelectedCountries(countries);
    setShuffledFlags(flags);
    setMatches(
      countries.reduce(
        (acc, c) => ({ ...acc, [c.code]: null }),
        {} as Record<string, string | null>
      )
    );
    setMatchStatus(
      countries.reduce(
        (acc, c) => ({ ...acc, [c.code]: "pending" }),
        {} as Record<string, MatchStatus>
      )
    );
    setWrongFlags(new Set());
    setGameStarted(false);
    setGameFinished(false);
    setTimeElapsed(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setDraggingFlag(null);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startGame();
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [startGame]);

  useEffect(() => {
    if (gameStarted && !gameFinished) {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameFinished]);

  const handleDrop = useCallback(
    (countryCode: string, flagCode: string) => {
      if (matches[countryCode] || gameFinished) return;

      if (!gameStarted) {
        setGameStarted(true);
      }

      setTotalAttempts((prev) => prev + 1);

      if (countryCode === flagCode) {
        setMatches((prev) => ({ ...prev, [countryCode]: flagCode }));
        setMatchStatus((prev) => ({ ...prev, [countryCode]: "correct" }));
        setCorrectCount((prev) => {
          const newCount = prev + 1;
          if (newCount === selectedCountries.length) {
            setTimeout(() => {
              if (timerRef.current) {
                window.clearInterval(timerRef.current);
              }
              setGameFinished(true);
            }, 600);
          }
          return newCount;
        });

        setWrongFlags((prev) => {
          const next = new Set(prev);
          next.delete(flagCode);
          return next;
        });
      } else {
        setMatchStatus((prev) => ({ ...prev, [countryCode]: "wrong" }));
        setWrongFlags((prev) => new Set(prev).add(flagCode));

        setTimeout(() => {
          setMatchStatus((prev) => ({ ...prev, [countryCode]: "pending" }));
          setWrongFlags((prev) => {
            const next = new Set(prev);
            next.delete(flagCode);
            return next;
          });
        }, 900);
      }
    },
    [matches, gameFinished, gameStarted, selectedCountries.length]
  );

  const matchedFlagSet = new Set(
    Object.values(matches).filter((v): v is string => v !== null)
  );

  return (
    <div className="min-h-screen relative z-10">
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        <GameHeader
          timeElapsed={timeElapsed}
          matchedCount={correctCount}
          totalCount={selectedCountries.length}
          onRestart={startGame}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
              <h2 className="font-display text-xl font-bold text-white/90 tracking-wide">
                国家名称
                <span className="text-white/40 text-base font-normal ml-2">
                  将国旗拖拽到对应位置
                </span>
              </h2>
            </div>
            <div className="space-y-4">
              {selectedCountries.map((country, idx) => (
                <CountryTarget
                  key={country.code}
                  country={country}
                  matchedFlagCode={matches[country.code]}
                  isCorrect={matchStatus[country.code] === "correct"}
                  isWrong={matchStatus[country.code] === "wrong"}
                  index={idx}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <h2 className="font-display text-xl font-bold text-white/90 tracking-wide">
                国旗卡片
                <span className="text-white/40 text-base font-normal ml-2">
                  共 {shuffledFlags.length} 面国旗
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {shuffledFlags.map((country, idx) => {
                const isMatched = matchedFlagSet.has(country.code);
                const isCorrectMatched = Object.entries(matches).some(
                  ([cc, fc]) => fc === country.code && cc === country.code
                );
                return (
                  <FlagCard
                    key={country.code}
                    country={country}
                    isCorrect={isCorrectMatched}
                    isWrong={wrongFlags.has(country.code)}
                    isMatched={isMatched}
                    onDragStart={(code) => setDraggingFlag(code)}
                    onDragEnd={() => setDraggingFlag(null)}
                    animationDelay={idx * 80 + 200}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-6 text-white/40 text-sm font-medium">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-success/80" />
              正确配对
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-danger/80" />
              错误提示
            </span>
            <span className="hidden sm:inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-accent-gold/80" />
              拖拽放置
            </span>
          </div>
          <p className="text-white/30 text-xs mt-3">
            题库覆盖 50 个国家 · 每次随机抽取 5 个
          </p>
        </div>
      </div>

      <ResultModal
        show={gameFinished}
        timeElapsed={timeElapsed}
        correctCount={correctCount}
        totalAttempts={totalAttempts}
        onRestart={startGame}
      />
    </div>
  );
}
