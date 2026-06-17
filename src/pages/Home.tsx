import GameHeader from "@/components/GameHeader";
import FlagCard from "@/components/FlagCard";
import CountryTarget from "@/components/CountryTarget";
import ResultModal from "@/components/ResultModal";
import { useGame } from "@/hooks/useGame";
import { TOTAL_COUNTRY_COUNT } from "@/data/countries";

export default function Home() {
  const {
    countries,
    shuffledFlags,
    phase,
    timeElapsed,
    roundSize,
    stats,
    handleDrop,
    startGame,
    getFlagState,
    getCountryStatus,
  } = useGame();

  return (
    <div className="min-h-screen relative z-10">
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        <GameHeader
          timeElapsed={timeElapsed}
          matchedCount={stats.correctCount}
          totalCount={roundSize}
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
              {countries.map((country, idx) => {
                const status = getCountryStatus(country.code);
                return (
                  <CountryTarget
                    key={country.code}
                    country={country}
                    matchedFlagCode={status.matchedFlagCode}
                    isCorrect={status.isCorrect}
                    isWrong={status.isWrong}
                    index={idx}
                    onDrop={handleDrop}
                  />
                );
              })}
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
                const flagState = getFlagState(country.code);
                return (
                  <FlagCard
                    key={country.code}
                    country={country}
                    isCorrect={flagState.isCorrect}
                    isWrong={flagState.isWrong}
                    isMatched={flagState.isMatched}
                    onDragStart={() => {}}
                    onDragEnd={() => {}}
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
            题库覆盖 {TOTAL_COUNTRY_COUNT} 个国家 · 每次随机抽取 {roundSize} 个
          </p>
        </div>
      </div>

      <ResultModal
        show={phase === "finished"}
        stats={stats}
        onRestart={startGame}
      />
    </div>
  );
}
