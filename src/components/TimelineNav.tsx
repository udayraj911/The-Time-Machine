import React, { useState, useEffect, useRef } from "react";
import { TIMELINE_POINTS, HISTORICAL_ERAS } from "../data/historicalData";
import { audio } from "../services/audioService";
import { ChevronLeft, ChevronRight, Zap, FastForward, Rewind, Calendar, Play, Pause, Shuffle } from "lucide-react";

interface TimelineNavProps {
  currentYear: number;
  onSelectYear: (year: number) => void;
  onInitiateTravel: (targetYear: number) => void;
}

export const TimelineNav: React.FC<TimelineNavProps> = ({
  currentYear,
  onSelectYear,
  onInitiateTravel,
}) => {
  const [customYearInput, setCustomYearInput] = useState<string>("");
  const [isInputOpen, setIsInputOpen] = useState<boolean>(false);
  const [isAutoplayActive, setIsAutoplayActive] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1); // 1x, 10x, 100x
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const formatYear = (yr: number) => {
    const abs = Math.abs(yr);
    if (abs >= 1000000000) {
      return `${(abs / 1000000000).toFixed(1)}B Yrs Ago`;
    }
    if (abs >= 1000000) {
      return `${(abs / 1000000).toFixed(0)}M Yrs Ago`;
    }
    if (abs >= 10000) {
      return `${(abs / 1000).toFixed(0)}K Yrs Ago`;
    }
    return yr < 0 ? `${abs} BC` : `${yr} CE`;
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customYearInput, 10);
    if (!isNaN(parsed) && parsed >= -13800000000 && parsed <= 10000) {
      audio.playClick(1000);
      onInitiateTravel(parsed);
      setIsInputOpen(false);
      setCustomYearInput("");
    }
  };

  const currentIndex = TIMELINE_POINTS.findIndex((y) => y === currentYear);

  const handlePrev = () => {
    audio.playClick(600);
    if (currentIndex > 0) {
      onInitiateTravel(TIMELINE_POINTS[currentIndex - 1]);
    } else {
      onInitiateTravel(Math.max(-13800000000, currentYear - 50));
    }
  };

  const handleNext = () => {
    audio.playClick(900);
    if (currentIndex >= 0 && currentIndex < TIMELINE_POINTS.length - 1) {
      onInitiateTravel(TIMELINE_POINTS[currentIndex + 1]);
    } else {
      onInitiateTravel(Math.min(10000, currentYear + 50));
    }
  };

  const handleRandomJump = () => {
    audio.playClick(1100);
    const randomIndex = Math.floor(Math.random() * TIMELINE_POINTS.length);
    onInitiateTravel(TIMELINE_POINTS[randomIndex]);
  };

  // Autoplay Logic: smoothly increments year depending on playSpeed
  useEffect(() => {
    if (isAutoplayActive) {
      autoplayTimer.current = setInterval(() => {
        onSelectYear(currentYear + playSpeed);
      }, 300);
    } else {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    }

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [isAutoplayActive, currentYear, playSpeed, onSelectYear]);

  return (
    <div className="relative w-full bg-slate-950/90 border-t border-cyan-500/20 py-4 px-4 backdrop-blur-xl z-30 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Top Control Header: Step backward, active year badge, warp to custom year, step forward */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <button
              id="timeline-prev-btn"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-300 transition cursor-pointer"
            >
              <Rewind className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PAST VECTOR</span>
            </button>

            {/* Micro Decrement */}
            <button
              onClick={() => {
                audio.playClick(500);
                onInitiateTravel(currentYear - 10);
              }}
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-white transition cursor-pointer"
            >
              -10 YR
            </button>
          </div>

          {/* Center Interactive Destination Trigger */}
          <div className="flex items-center gap-3">
            {/* Play/Pause Autoplay */}
            <button
              onClick={() => {
                audio.playClick(850);
                setIsAutoplayActive(!isAutoplayActive);
              }}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                isAutoplayActive
                  ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  : "bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-300"
              }`}
              title={isAutoplayActive ? "Pause Temporal Flow" : "Autoplay Temporal Flow"}
            >
              {isAutoplayActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Play Speed Multiplier Selector (only visible if autoplay is on) */}
            {isAutoplayActive && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 font-mono text-[10px]">
                {[1, 10, 100].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      audio.playClick(700);
                      setPlaySpeed(spd);
                    }}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      playSpeed === spd
                        ? "bg-amber-500 text-black font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            )}

            <button
              id="center-initiate-travel-btn"
              onClick={() => onInitiateTravel(currentYear)}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-black text-sm tracking-widest flex items-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>INITIATE TIME TRAVEL</span>
            </button>

            {/* Custom Coordinate Input Trigger */}
            <button
              onClick={() => setIsInputOpen(!isInputOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
              title="Input Specific Year"
            >
              <Calendar className="w-4 h-4" />
            </button>

            {/* Random Discovery Warp */}
            <button
              onClick={handleRandomJump}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 transition cursor-pointer"
              title="Warp to Random Era"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Micro Increment */}
            <button
              onClick={() => {
                audio.playClick(950);
                onInitiateTravel(currentYear + 10);
              }}
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-white transition cursor-pointer"
            >
              +10 YR
            </button>

            <button
              id="timeline-next-btn"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-300 transition cursor-pointer"
            >
              <span className="hidden sm:inline">FUTURE VECTOR</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Custom Year Direct Input Popover */}
        {isInputOpen && (
          <form
            onSubmit={handleCustomSubmit}
            className="flex items-center justify-center gap-2 p-3 bg-slate-900/90 border border-cyan-500/40 rounded-xl max-w-md mx-auto w-full backdrop-blur-md"
          >
            <span className="text-xs font-mono text-cyan-400 whitespace-nowrap">ENTER TARGET YEAR:</span>
            <input
              type="number"
              placeholder="e.g. 1969, -44, -250000000"
              value={customYearInput}
              onChange={(e) => setCustomYearInput(e.target.value)}
              className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 py-1 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs cursor-pointer"
            >
              JUMP
            </button>
          </form>
        )}

        {/* Horizontal Panoramic Timeline Track */}
        <div className="relative w-full overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-cyan-500/30">
          <div className="flex items-center justify-between min-w-[960px] gap-2 px-4 relative">
            {/* Connecting neon line */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-slate-800 z-0">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-500 opacity-60"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      ((currentYear + 13800000000) / (10000 + 13800000000)) * 100
                    )
                  )}%`,
                }}
              />
            </div>

            {/* Timeline Year Nodes */}
            {TIMELINE_POINTS.map((yr) => {
              const isSelected = yr === currentYear;
              const eraMeta = HISTORICAL_ERAS.find((e) => e.year === yr);
              return (
                <button
                  key={yr}
                  onClick={() => {
                    audio.playClick(800);
                    onInitiateTravel(yr);
                  }}
                  className={`group relative z-10 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected ? "scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Glowing Node Dot */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected
                        ? "bg-cyan-400 border-white shadow-[0_0_15px_#38bdf8]"
                        : "bg-slate-950 border-slate-700 group-hover:border-cyan-400"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>

                  {/* Year Tag Label */}
                  <span
                    className={`text-[10px] font-mono font-bold tracking-tight whitespace-nowrap px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  >
                    {formatYear(yr)}
                  </span>

                  {/* Tiny Era Name Preview */}
                  {eraMeta && (
                    <span className="hidden md:inline text-[9px] font-mono text-slate-400 max-w-[80px] truncate text-center">
                      {eraMeta.eraName.split(" ")[0]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
