import { Timer, Trophy, RotateCcw } from "lucide-react";
import { formatTimeDisplay } from "@/utils/gameEngine";

interface GameHeaderProps {
  timeElapsed: number;
  matchedCount: number;
  totalCount: number;
  onRestart: () => void;
}

export default function GameHeader({
  timeElapsed,
  matchedCount,
  totalCount,
  onRestart,
}: GameHeaderProps) {
  const progress = totalCount > 0 ? (matchedCount / totalCount) * 100 : 0;

  return (
    <div className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="font-display text-3xl md:text-4xl font-black bg-gradient-to-r from-accent-gold via-accent-goldLight to-amber-200 bg-clip-text text-transparent tracking-tight">
            🌍 国旗配对挑战
          </h1>
          <p className="text-white/60 text-sm mt-1 font-medium">
            拖拽国旗到对应的国家名称上完成配对
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
            <Timer className="w-5 h-5 text-accent-gold" />
            <span className="font-display text-2xl font-bold text-white tabular-nums min-w-[64px] text-center">
              {formatTimeDisplay(timeElapsed)}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
            <Trophy className="w-5 h-5 text-accent-gold" />
            <span className="font-display text-xl font-bold text-white tabular-nums">
              {matchedCount}
              <span className="text-white/40 text-base"> / {totalCount}</span>
            </span>
          </div>

          <button
            onClick={onRestart}
            className="group flex items-center gap-2 bg-gradient-to-r from-accent-gold to-amber-500 hover:from-amber-400 hover:to-accent-gold text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent-gold/30 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            <span className="hidden sm:inline">重新开始</span>
          </button>
        </div>
      </div>

      <div className="mt-6 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-accent-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
