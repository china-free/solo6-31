import { useEffect, useState } from "react";
import { Trophy, Clock, Target, RotateCcw, Sparkles } from "lucide-react";
import { formatTimeReadable, getRating, type GameStats } from "@/utils/gameEngine";

interface ResultModalProps {
  show: boolean;
  stats: GameStats;
  onRestart: () => void;
}

const CONFETTI_COLORS = [
  "#fbbf24",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
];

export default function ResultModal({
  show,
  stats,
  onRestart,
}: ResultModalProps) {
  const [confetti, setConfetti] = useState<
    { id: number; left: number; delay: number; duration: number; color: string }[]
  >([]);

  const rating = getRating(stats.accuracy, stats.timeElapsed);

  useEffect(() => {
    if (show) {
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.5 + Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      }));
      setConfetti(pieces);

      const timer = setTimeout(() => setConfetti([]), 4500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          onClick={onRestart}
        />

        <div className="relative animate-modal-in glass-card-strong rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl">
          <div
            className={`absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br ${rating.color} flex items-center justify-center text-4xl shadow-2xl`}
          >
            {rating.emoji}
          </div>

          <div className="text-center mt-6">
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-2">
              挑战完成！
            </h2>
            <p
              className={`text-xl font-bold bg-gradient-to-r ${rating.color} bg-clip-text text-transparent mb-8`}
            >
              <Sparkles className="w-5 h-5 inline mr-1" />
              {rating.text}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-sky-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-white/50 text-sm font-medium">用时</div>
                    <div className="text-white font-bold text-lg">
                      {formatTimeReadable(stats.timeElapsed)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-white/50 text-sm font-medium">正确率</div>
                    <div className="text-white font-bold text-lg">
                      {stats.accuracy}%
                      <span className="text-white/40 text-sm ml-2">
                        ({stats.correctCount}/{stats.totalAttempts}次尝试)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-white/50 text-sm font-medium">配对数</div>
                    <div className="text-white font-bold text-lg">
                      {stats.correctCount} 个国家
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onRestart}
              className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-accent-gold via-amber-400 to-accent-goldLight hover:from-amber-400 hover:via-accent-gold hover:to-amber-400 text-slate-900 font-black px-6 py-4 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-accent-gold/40 hover:scale-[1.02] active:scale-95 bg-size-200 bg-pos-0 hover:bg-pos-100"
              style={{
                backgroundSize: "200% auto",
              }}
            >
              <RotateCcw className="w-5 h-5 transition-transform duration-500 group-hover:rotate-[360deg]" />
              再玩一次
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
