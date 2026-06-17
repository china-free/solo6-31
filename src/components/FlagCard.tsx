import { useState } from "react";
import type { Country } from "@/data/countries";
import { getFlagUrl } from "@/data/countries";

interface FlagCardProps {
  country: Country;
  isCorrect: boolean;
  isWrong: boolean;
  isMatched: boolean;
  onDragStart: (code: string) => void;
  onDragEnd: () => void;
  animationDelay?: number;
}

export default function FlagCard({
  country,
  isCorrect,
  isWrong,
  isMatched,
  onDragStart,
  onDragEnd,
  animationDelay = 0,
}: FlagCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const borderColor = isCorrect
    ? "border-emerald-400 ring-2 ring-emerald-400/60 animate-glow-success"
    : isWrong
    ? "border-rose-500 ring-2 ring-rose-500/60 animate-shake"
    : "border-white/10 hover:border-accent-gold/50";

  const bgOverlay = isCorrect
    ? "bg-emerald-500/20"
    : isWrong
    ? "bg-rose-500/20"
    : "bg-white/5";

  const handleDragStart = (e: React.DragEvent) => {
    if (isMatched) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", country.code);
    e.dataTransfer.effectAllowed = "move";
    onDragStart(country.code);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  return (
    <div
      className={`flag-card ${isDragging ? "dragging" : ""} ${
        isMatched ? "pointer-events-none opacity-40 scale-90" : ""
      }`}
      draggable={!isMatched}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        animation: `slide-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay}ms backwards`,
      }}
    >
      <div
        className={`relative rounded-2xl border-2 ${borderColor} ${bgOverlay} p-4 transition-all duration-300 overflow-hidden`}
      >
        <div className="aspect-[3/2] w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 shadow-inner">
          <img
            src={getFlagUrl(country.code)}
            alt={`${country.name}国旗`}
            className="w-full h-full object-cover"
            draggable={false}
            loading="lazy"
          />
        </div>

        {isCorrect && (
          <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {isWrong && (
          <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}

        <div className="mt-3 text-center">
          <span className="text-xs text-white/40 font-medium tracking-wider uppercase">
            拖拽到对应国家
          </span>
        </div>
      </div>
    </div>
  );
}
