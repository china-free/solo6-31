import { useState } from "react";
import type { Country } from "@/data/countries";
import { getFlagUrl } from "@/data/countries";

interface CountryTargetProps {
  country: Country;
  matchedFlagCode: string | null;
  isCorrect: boolean;
  isWrong: boolean;
  index: number;
  onDrop: (countryCode: string, flagCode: string) => void;
}

export default function CountryTarget({
  country,
  matchedFlagCode,
  isCorrect,
  isWrong,
  index,
  onDrop,
}: CountryTargetProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!matchedFlagCode) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (matchedFlagCode) return;
    const flagCode = e.dataTransfer.getData("text/plain");
    if (flagCode) {
      onDrop(country.code, flagCode);
    }
  };

  const borderStyle = isCorrect
    ? "border-emerald-400/80 ring-2 ring-emerald-400/30 bg-emerald-500/15"
    : isWrong
    ? "border-rose-500/80 ring-2 ring-rose-500/40 bg-rose-500/20"
    : isDragOver
    ? "drag-over border-accent-gold/60 bg-accent-gold/10"
    : "border-white/10 hover:border-white/20 bg-white/3";

  return (
    <div
      className={`country-target ${isWrong ? "animate-shake" : ""} ${borderStyle} ${
        isDragOver && !matchedFlagCode && !isCorrect && !isWrong ? "drag-over" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        animation: isWrong
          ? undefined
          : `slide-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${
              index * 80
            }ms backwards`,
      }}
    >
      <div
        className={`glass-card rounded-2xl p-5 border-2 transition-all duration-300 h-full min-h-[120px] flex items-center gap-4 ${borderStyle}`}
      >
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
            isCorrect
              ? "bg-emerald-500 text-white"
              : isWrong
              ? "bg-rose-500 text-white"
              : "bg-gradient-to-br from-accent-gold to-amber-500 text-slate-900"
          } shadow-lg`}
        >
          {isCorrect ? (
            <svg
              className="w-6 h-6"
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
          ) : isWrong ? (
            <svg
              className="w-6 h-6"
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
          ) : (
            index + 1
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">
            {country.name}
          </h3>
          <p className="text-white/40 text-sm mt-0.5 font-medium tracking-wide">
            {country.nameEn} · {country.continent}
          </p>
        </div>

        <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-white/10 bg-white/5">
          {matchedFlagCode && isCorrect ? (
            <img
              src={getFlagUrl(matchedFlagCode)}
              alt="已配对"
              className="w-full h-full object-cover"
            />
          ) : isWrong ? (
            <div className="w-full h-full flex items-center justify-center bg-rose-500/30">
              <svg
                className="w-7 h-7 text-rose-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
