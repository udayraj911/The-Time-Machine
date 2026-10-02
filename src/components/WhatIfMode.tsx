import React, { useState } from "react";
import { AlternateTimelineScenario } from "../types";
import { generateAlternateTimeline } from "../services/apiService";
import { audio } from "../services/audioService";
import {
  GitFork,
  Sparkles,
  Zap,
  RefreshCw,
  Send,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface WhatIfModeProps {
  onWarpToYear: (year: number) => void;
}

export const WhatIfMode: React.FC<WhatIfModeProps> = ({ onWarpToYear }) => {
  const [customPremise, setCustomPremise] = useState<string>("");
  const [activeScenario, setActiveScenario] = useState<AlternateTimelineScenario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const presetHypotheses = [
    {
      label: "Library of Alexandria Never Burned",
      premise: "What if the Library of Alexandria never burned and classical scientific knowledge survived intact?",
      year: -48,
    },
    {
      label: "Industrial Revolution in 1000 AD",
      premise: "What if the Industrial Revolution started in 1000 AD in the Song Dynasty and Mediterranean?",
      year: 1000,
    },
    {
      label: "Internet Invented in 1950",
      premise: "What if the internet and global digital network were invented in 1950 during early mainframe era?",
      year: 1950,
    },
    {
      label: "Humanity Landed on Mars in 1980",
      premise: "What if Apollo post-lunar program accelerated to land humans on Mars by 1980?",
      year: 1980,
    },
    {
      label: "Penicillin Discovered in 1850",
      premise: "What if antibiotics and germ theory were fully operational during the mid-19th century?",
      year: 1850,
    },
  ];

  const handleSimulate = async (premiseToRun: string, divYear?: number) => {
    if (!premiseToRun.trim() || isLoading) return;

    audio.playWormholeWarp();
    setIsLoading(true);

    try {
      const res = await generateAlternateTimeline(premiseToRun, divYear);
      setActiveScenario(res.alternateScenario);
      audio.playArrivalImpact();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 z-10 text-white space-y-8 select-none">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
          <GitFork className="w-4 h-4 text-purple-400" />
          <span>QUANTUM BRANCHING TIMELINE ENGINE</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
          WHAT IF? // ALTERNATE TIMELINES
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Inject a historical divergence at any quantum nexus point and compute the cascading butterfly effects across world politics, technological evolution, and contemporary reality.
        </p>

        {/* Preset Hypotheses Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {presetHypotheses.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomPremise(p.premise);
                handleSimulate(p.premise, p.year);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 hover:border-purple-400 text-xs font-mono text-purple-200 transition cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulate(customPremise);
          }}
          className="flex items-center gap-2 pt-4 border-t border-slate-800"
        >
          <input
            type="text"
            placeholder="Type any historical divergence hypothesis (e.g. 'What if Nikola Tesla completed Wardenclyffe Tower wireless power in 1905?')"
            value={customPremise}
            onChange={(e) => setCustomPremise(e.target.value)}
            className="flex-1 bg-slate-900/90 border border-slate-700 focus:border-purple-400 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !customPremise.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>BRANCH TIMELINE</span>
          </button>
        </form>
      </div>

      {/* Simulation Result Presentation */}
      {isLoading ? (
        <div className="p-16 rounded-3xl bg-slate-950/80 border border-purple-500/20 text-center flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-10 h-10 text-purple-400 animate-spin" />
          <p className="text-sm font-mono text-purple-300 tracking-widest uppercase">
            CALCULATING MULTI-ORDER QUANTUM BUTTERFLY DISPERSION MATRIX...
          </p>
        </div>
      ) : activeScenario ? (
        <div className="space-y-6">
          {/* Scenario Header & Score */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/90 border border-purple-500/40 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-purple-300 tracking-wider">
                DIVERGENCE NEXUS: {activeScenario.divergencePoint}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                  {activeScenario.butterflyIndex}
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                  DIVERGENCE SCORE: {activeScenario.quantumDivergenceScore}/100
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-black font-mono text-white">
              {activeScenario.title}
            </h2>

            {/* Cascading Orders of Consequence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  1ST ORDER IMPACT (IMMEDIATE):
                </span>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {activeScenario.firstOrderImpact}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-sky-400 font-bold uppercase">
                  2ND ORDER IMPACT (20-50 YEARS):
                </span>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {activeScenario.secondOrderImpact}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                  MODERN 2026 CONSEQUENCES:
                </span>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {activeScenario.modernConsequences}
                </p>
              </div>
            </div>

            {/* Unintended Butterfly Consequence */}
            {activeScenario.unintendedConsequence && (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs md:text-sm font-mono text-rose-200 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-bold text-rose-300 uppercase">UNINTENDED PARADOX ANOMALY:</span>{" "}
                  {activeScenario.unintendedConsequence}
                </div>
              </div>
            )}
          </div>

          {/* Prime Timeline vs Alternate Timeline Comparison Table */}
          {activeScenario.timelineComparison && (
            <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>TIMELINE CHRONOLOGICAL DRIFT COMPARISON</span>
              </h3>

              <div className="space-y-3">
                {activeScenario.timelineComparison.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono items-center"
                  >
                    <div className="text-cyan-400 font-bold md:col-span-1">
                      YEAR {row.year < 0 ? `${Math.abs(row.year)} BCE` : `${row.year} CE`}
                    </div>
                    <div className="md:col-span-2 text-slate-400">
                      <span className="text-[10px] text-slate-400 uppercase block mb-0.5">
                        PRIME TIMELINE:
                      </span>
                      {row.primeEvent}
                    </div>
                    <div className="md:col-span-2 text-purple-200 bg-purple-950/30 p-2.5 rounded-lg border border-purple-500/20">
                      <span className="text-[10px] text-purple-400 uppercase block mb-0.5 font-bold">
                        ALTERNATE REALITY:
                      </span>
                      {row.alternateEvent}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
