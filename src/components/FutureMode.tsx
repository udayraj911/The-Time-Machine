import React, { useState, useEffect } from "react";
import { FutureScenario } from "../types";
import { simulateFutureEra } from "../services/apiService";
import { audio } from "../services/audioService";
import {
  Sparkles,
  Rocket,
  Cpu,
  Building,
  Zap,
  Navigation,
  Globe,
  RefreshCw,
  AlertCircle,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface FutureModeProps {
  initialYear?: number;
  onWarpToYear: (year: number) => void;
}

export const FutureMode: React.FC<FutureModeProps> = ({
  initialYear = 2100,
  onWarpToYear,
}) => {
  const [targetYear, setTargetYear] = useState<number>(initialYear >= 2030 ? initialYear : 2100);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [scenarioData, setScenarioData] = useState<FutureScenario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const presetYears = [2050, 2075, 2100, 2150, 2200, 2500, 3000];

  const loadFutureScenario = (yr: number, dom: string = "all") => {
    setIsLoading(true);
    audio.playHoloBeep();

    simulateFutureEra(yr, dom)
      .then((res) => {
        setScenarioData(res.futureScenario);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadFutureScenario(targetYear, selectedDomain);
  }, [targetYear, selectedDomain]);

  const handleYearChange = (yr: number) => {
    audio.playClick(900);
    setTargetYear(yr);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 z-10 text-white space-y-8 select-none">
      {/* Header Banner with Mandatory Disclaimer */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-sky-500/30 backdrop-blur-xl space-y-4">
        {/* Speculative Simulation Disclaimer */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold tracking-wider">
            AI-GENERATED FUTURE SCENARIO (SPECULATIVE SIMULATION)
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <span>FUTURE SIMULATOR // {targetYear} CE</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Extrapolating quantum computing, planetary terraforming, post-scarcity energy economics, and synthetic biology vectors into distant centuries.
            </p>
          </div>

          <button
            onClick={() => loadFutureScenario(targetYear, selectedDomain)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition cursor-pointer self-start"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>REGENERATE MODEL</span>
          </button>
        </div>

        {/* Future Year Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-800 scrollbar-none">
          <span className="text-xs font-mono text-slate-400 uppercase mr-2">CHRONO-HORIZON:</span>
          {presetYears.map((yr) => {
            const isSelected = yr === targetYear;
            return (
              <button
                key={yr}
                onClick={() => handleYearChange(yr)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {yr} CE
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Speculative Scenario Content */}
      {isLoading ? (
        <div className="p-16 rounded-3xl bg-slate-950/80 border border-slate-800 text-center flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-sm font-mono text-cyan-300 tracking-widest uppercase">
            CALCULATING MULTI-AGENT PROBABILISTIC PROJECTIONS FOR YEAR {targetYear}...
          </p>
        </div>
      ) : scenarioData ? (
        <div className="space-y-8">
          {/* Top Era Overview Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/20 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 tracking-wider">
                CIVILIZATION STATUS MODEL
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                PLAUSIBILITY INDEX: {scenarioData.speculativePlausibility}%
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold font-mono text-white">
              {scenarioData.eraTitle}
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-4xl">
              {scenarioData.overview}
            </p>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs md:text-sm font-mono text-cyan-200">
              <span className="text-cyan-400 font-bold uppercase">SNAPSHOT OF DAILY CITIZEN LIFE:</span>{" "}
              {scenarioData.dailyLifeSnapshot}
            </div>
          </div>

          {/* 6 Core Domain Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold mb-3">
                <Cpu className="w-4 h-4" />
                <span>COMPUTATION & TECH</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {scenarioData.domains.technology}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold mb-3">
                <Building className="w-4 h-4" />
                <span>ARCOLOGIES & CITIES</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {scenarioData.domains.cities}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
              <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold mb-3">
                <Rocket className="w-4 h-4" />
                <span>INTERPLANETARY HABITATION</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {scenarioData.domains.space}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-3">
                <Zap className="w-4 h-4" />
                <span>POST-SCARCITY ENERGY</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {scenarioData.domains.energy}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>SYMBIOTIC AI NETWORKS</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {scenarioData.domains.ai}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-3">
                <Navigation className="w-4 h-4" />
                <span>TRANSIT & WARP INFRASTRUCTURE</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {scenarioData.domains.transportation}
              </p>
            </div>
          </div>

          {/* Key Milestones Leading up to target year */}
          {scenarioData.keyMilestones && (
            <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold font-mono text-white uppercase tracking-wider">
                HISTORICAL PRECURSORS LEADING TO {targetYear}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarioData.keyMilestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-1"
                  >
                    <span className="text-cyan-400 font-bold">{m.year} CE</span>
                    <p className="text-slate-300">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Civilization Greatest Challenge */}
          {scenarioData.greatestChallenge && (
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs md:text-sm font-mono text-rose-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-rose-400 font-bold uppercase">CIVILIZATIONAL PARADOX / CHALLENGE:</span>{" "}
                {scenarioData.greatestChallenge}
              </div>
              <button
                onClick={() => onWarpToYear(targetYear)}
                className="shrink-0 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition cursor-pointer"
              >
                LOCK TEMPORAL COORDINATE
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
