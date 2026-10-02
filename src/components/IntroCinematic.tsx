import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../services/audioService";
import { Sparkles, Shield, Compass, ChevronRight, Zap, Volume2, VolumeX } from "lucide-react";

interface IntroCinematicProps {
  onEnter: (targetYear?: number) => void;
  initialPhase?: number;
}

export const IntroCinematic: React.FC<IntroCinematicProps> = ({
  onEnter,
  initialPhase = 0,
}) => {
  const [bootPhase, setBootPhase] = useState<number>(initialPhase);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [warpYearText, setWarpYearText] = useState<number>(2026);

  // Progressive boot sequence orchestration
  useEffect(() => {
    if (initialPhase >= 5) {
      audio.startAmbient();
      return;
    }

    // Phase 0: Pitch Black (0s - 1.2s)
    const t1 = setTimeout(() => {
      setBootPhase(1); // Particles & Energy Ring form
      audio.playBootSequence();
    }, 1200);

    // Phase 1 -> 2: Reveal CHRONOS title (2.4s)
    const t2 = setTimeout(() => {
      setBootPhase(2);
      audio.playHoloBeep();
    }, 2500);

    // Phase 2 -> 3: TEMPORAL EXPLORATION SYSTEM + Scan line (3.8s)
    const t3 = setTimeout(() => {
      setBootPhase(3);
    }, 3800);

    // Phase 3 -> 4: SYSTEM ONLINE + CURRENT TEMPORAL POSITION 2026 (5.0s)
    const t4 = setTimeout(() => {
      setBootPhase(4);
      audio.playHoloBeep();
    }, 5000);

    // Phase 4 -> 5: Full Cinematic Gateway Landing Display (6.2s)
    const t5 = setTimeout(() => {
      setBootPhase(5);
      audio.startAmbient();
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [initialPhase]);

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = audio.toggleMute();
    setSoundEnabled(newState);
  };

  const handleLaunch = (targetYear: number = 2026) => {
    audio.playWormholeWarp();
    setIsTransitioning(true);

    // Rapidly cycle dates in hyperspace transition
    const sampleDates = [2026, 2010, 1990, 1969, 1947, 1905, 1789, 1492, -44, 2026];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < sampleDates.length) {
        setWarpYearText(sampleDates[idx]);
      }
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      audio.playArrivalImpact();
      onEnter(targetYear);
    }, 2200);
  };

  const handleSkip = () => {
    setBootPhase(5);
    audio.startAmbient();
  };

  return (
    <div
      id="chronos-intro-overlay"
      className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Sound Toggle Button */}
      <button
        id="intro-sound-toggle"
        onClick={handleSoundToggle}
        className="absolute top-6 right-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-slate-800 transition backdrop-blur-md cursor-pointer"
        title="Toggle Sound Design"
      >
        {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        <span>{soundEnabled ? "AUDIO: ACTIVE" : "AUDIO: MUTED"}</span>
      </button>

      {/* Skip Boot Button */}
      {bootPhase < 5 && (
        <button
          id="skip-boot-button"
          onClick={handleSkip}
          className="absolute top-6 left-6 z-30 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700 text-xs font-mono text-slate-400 hover:text-white hover:border-slate-500 transition cursor-pointer"
        >
          SKIP BOOT SEQUENCE [ESC]
        </button>
      )}

      {/* Background Animated Particle Grid */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      </div>

      {/* PHASE 1 - 4: INITIAL CINEMATIC BOOT ENGINE */}
      {bootPhase < 5 && (
        <div className="relative flex flex-col items-center justify-center max-w-xl text-center px-6">
          {/* Energy Ring */}
          {bootPhase >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{ duration: 3, ease: "easeOut", rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
              className="relative w-48 h-48 mb-8 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 border-b-sky-300 animate-spin" />
              <div className="absolute inset-3 rounded-full border border-sky-400/20 border-dashed animate-reverse-spin" />
              <div className="w-24 h-24 rounded-full bg-cyan-500/10 blur-xl animate-pulse" />
              <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
            </motion.div>
          )}

          {/* CHRONOS Title */}
          {bootPhase >= 2 && (
            <motion.h1
              initial={{ opacity: 0, y: 15, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.25em" }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-widest font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-400"
            >
              CHRONOS
            </motion.h1>
          )}

          {/* Subtitle & Scan Line */}
          {bootPhase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mt-3 mb-6"
            >
              <p className="text-xs md:text-sm font-mono uppercase tracking-[0.35em] text-cyan-400/80">
                TEMPORAL EXPLORATION SYSTEM
              </p>
              {/* Scan Bar Animation */}
              <motion.div
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 w-16 h-[2px] bg-cyan-400 shadow-[0_0_8px_#38bdf8]"
              />
            </motion.div>
          )}

          {/* System Online & Current Temporal Position */}
          {bootPhase >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-2 mt-4 font-mono text-xs text-slate-400 border border-cyan-500/20 bg-slate-950/60 p-4 rounded-lg backdrop-blur-md"
            >
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold tracking-widest">SYSTEM ONLINE</span>
              </div>
              <p className="text-slate-400">
                CURRENT TEMPORAL POSITION: <span className="text-white font-bold text-sm">2026 CE</span>
              </p>
              <p className="text-[11px] text-cyan-300/70">WORMHOLE RESONANCE MATRIX: LOCKED & READY</p>
            </motion.div>
          )}
        </div>
      )}

      {/* PHASE 5: FULL INTERACTIVE GATEWAY LANDING */}
      {bootPhase >= 5 && !isTransitioning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 max-w-4xl w-full px-6 py-8 flex flex-col items-center text-center"
        >
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 backdrop-blur-xl mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>QUANTUM COHERENCE: 99.98%</span>
            <span className="text-slate-600">|</span>
            <span>ORIGIN: 2026 CE</span>
          </div>

          {/* Central Monolithic Title */}
          <h1 className="text-6xl md:text-8xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_35px_rgba(56,189,248,0.25)]">
            CHRONOS
          </h1>

          <h2 className="text-xl md:text-3xl font-light text-slate-200 mt-4 max-w-2xl">
            “What if you could visit any moment?”
          </h2>

          <p className="text-sm md:text-base text-slate-400 mt-3 max-w-xl leading-relaxed">
            Explore the past, simulate possible futures, and experience human history as an interactive journey through time.
          </p>

          {/* Central Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full justify-center">
            <button
              id="enter-timemachine-btn"
              onClick={() => handleLaunch(2026)}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>ENTER THE TIMELINE</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="explore-history-btn"
              onClick={() => handleLaunch(1969)}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-white font-mono text-sm tracking-wider flex items-center justify-center gap-3 backdrop-blur-xl transition cursor-pointer"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE HISTORY (1969 MOON)</span>
            </button>
          </div>

          {/* Quick Destination Portal Badges */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 w-full max-w-2xl">
            <p className="text-xs font-mono text-slate-400 tracking-wider mb-4 uppercase">
              QUICK TEMPORAL VECTORS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { year: -2560, label: "2560 BC — Pyramids of Giza" },
                { year: -44, label: "44 BC — Fall of Rome" },
                { year: 1492, label: "1492 — Age of Discovery" },
                { year: 1789, label: "1789 — French Revolution" },
                { year: 1905, label: "1905 — Einstein Miracle Year" },
                { year: 1947, label: "1947 — Indian Independence" },
                { year: 1969, label: "1969 — Apollo 11 Landing" },
                { year: 1989, label: "1989 — Fall of Berlin Wall" },
                { year: 2050, label: "2050 — Mars Colony" },
                { year: 2100, label: "2100 — Dyson Swarm" },
              ].map((item) => (
                <button
                  key={item.year}
                  onClick={() => handleLaunch(item.year)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* HYPERSPACE WORMHOLE ENTRY TRANSITION ANIMATION */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            {/* Speed lines */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: (Math.random() - 0.5) * window.innerWidth,
                    y: (Math.random() - 0.5) * window.innerHeight,
                    scale: 0.1,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0.1, 4, 12],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: Math.random() * 0.8,
                    ease: "easeIn",
                  }}
                  className="absolute w-1 h-32 bg-gradient-to-b from-transparent via-cyan-400 to-white rounded-full blur-[1px]"
                  style={{
                    transformOrigin: "center center",
                    rotate: `${Math.random() * 360}deg`,
                  }}
                />
              ))}
            </div>

            {/* Central accelerating date display */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <p className="text-xs font-mono text-cyan-400 tracking-[0.4em] mb-2 animate-pulse">
                TRAVERSING TEMPORAL COORDINATES
              </p>
              <motion.div
                key={warpYearText}
                initial={{ scale: 0.8, opacity: 0.4 }}
                animate={{ scale: 1.2, opacity: 1 }}
                className="text-7xl md:text-9xl font-black font-mono text-white tracking-widest drop-shadow-[0_0_50px_#38bdf8]"
              >
                {warpYearText < 0 ? `${Math.abs(warpYearText)} BCE` : `${warpYearText} CE`}
              </motion.div>
              <p className="text-xs font-mono text-slate-400 mt-4">
                CALCULATING RELATIVISTIC TIME DILATION MATRIX...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
