import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../services/audioService";
import { Zap, Gauge, Orbit } from "lucide-react";

interface WormholeTransitionProps {
  fromYear: number;
  toYear: number;
  onComplete: () => void;
}

export const WormholeTransition: React.FC<WormholeTransitionProps> = ({
  fromYear,
  toYear,
  onComplete,
}) => {
  const [phase, setPhase] = useState<"CALCULATING" | "WARPING" | "ARRIVAL">("CALCULATING");
  const [currentDisplayYear, setCurrentDisplayYear] = useState<number>(fromYear);

  useEffect(() => {
    // Step 1: Calculating phase (0 - 1.2s)
    audio.playHoloBeep();

    const t1 = setTimeout(() => {
      setPhase("WARPING");
      audio.playWormholeWarp();

      // Rapidly interpolate year numbers
      const steps = 18;
      const stepDuration = 100; // ms
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        // Ease in-out interpolation
        const interpolated = Math.round(fromYear + (toYear - fromYear) * Math.pow(progress, 1.4));
        setCurrentDisplayYear(interpolated);

        if (currentStep >= steps) {
          clearInterval(timer);
          setCurrentDisplayYear(toYear);
          setPhase("ARRIVAL");
          audio.playArrivalImpact();

          setTimeout(() => {
            onComplete();
          }, 1400);
        }
      }, stepDuration);
    }, 1400);

    return () => {
      clearTimeout(t1);
    };
  }, [fromYear, toYear, onComplete]);

  const yearDisplay = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  };

  const temporalDistance = Math.abs(toYear - fromYear);
  const direction = toYear > fromYear ? "FUTURE" : "PAST";

  return (
    <div
      id="wormhole-warp-overlay"
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background radial flash */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)] pointer-events-none" />

      {/* PHASE 1: CALCULATING TEMPORAL VECTOR */}
      {phase === "CALCULATING" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="relative max-w-lg w-full mx-4 p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-center shadow-[0_0_50px_rgba(6,182,212,0.2)]"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex items-center justify-center">
            <Orbit className="w-8 h-8 text-cyan-400" />
          </div>

          <p className="text-xs font-mono text-cyan-400 tracking-[0.3em] uppercase mb-1">
            LOCKING TEMPORAL DESTINATION
          </p>

          <h2 className="text-4xl font-extrabold font-mono text-white mb-6">
            YEAR: {yearDisplay(toYear)}
          </h2>

          <div className="space-y-3 text-left font-mono text-xs text-slate-300 bg-black/50 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-cyan-300">
              <span>CALCULATING TEMPORAL VECTOR...</span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
            <div className="flex justify-between items-center text-cyan-300">
              <span>STABILIZING WORMHOLE...</span>
              <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>TEMPORAL DRIFT ESTIMATE:</span>
              <span className="text-yellow-400">0.003% (SAFE)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>TRAJECTORY DELTA:</span>
              <span className="text-white">
                {temporalDistance} YEARS INTO THE {direction}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* PHASE 2: ACTIVE HYPERSPACE WARP */}
      {phase === "WARPING" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative text-center flex flex-col items-center z-10"
        >
          <p className="text-sm font-mono text-cyan-400 tracking-[0.4em] mb-4 animate-pulse">
            TRAVERSING TEMPORAL SHEARSTREAM
          </p>

          <motion.div
            key={currentDisplayYear}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1.15, opacity: 1 }}
            className="text-8xl md:text-9xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_60px_#38bdf8]"
          >
            {yearDisplay(currentDisplayYear)}
          </motion.div>

          <div className="flex items-center gap-3 mt-6 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
            <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>RELATIVISTIC DILATION: ACTIVE</span>
          </div>
        </motion.div>
      )}

      {/* PHASE 3: ARRIVAL IMPACT */}
      {phase === "ARRIVAL" && (
        <motion.div
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative text-center flex flex-col items-center z-10"
        >
          <div className="px-5 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-mono tracking-widest mb-4">
            TEMPORAL SYNCHRONIZATION ACHIEVED
          </div>

          <h1 className="text-6xl md:text-8xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 drop-shadow-[0_0_40px_rgba(56,189,248,0.6)]">
            ARRIVAL: {yearDisplay(toYear)}
          </h1>

          <p className="text-sm font-mono text-slate-300 mt-4 tracking-wider">
            MATERIALIZING HISTORICAL ENVIRONMENT...
          </p>
        </motion.div>
      )}
    </div>
  );
};
