import React, { useState } from "react";
import { ParadoxScenario, ParadoxChoice } from "../types";
import { PARADOX_SCENARIOS } from "../data/paradoxData";
import { audio } from "../services/audioService";
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle2,
  HelpCircle,
  Clock,
  RotateCcw,
} from "lucide-react";

interface ParadoxSimulatorProps {
  onStabilityChange: (newStability: number) => void;
  currentStability: number;
}

export const ParadoxSimulator: React.FC<ParadoxSimulatorProps> = ({
  onStabilityChange,
  currentStability,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ParadoxScenario>(PARADOX_SCENARIOS[0]);
  const [chosenChoice, setChosenChoice] = useState<ParadoxChoice | null>(null);

  const handleSelectScenario = (sc: ParadoxScenario) => {
    audio.playClick(800);
    setSelectedScenario(sc);
    setChosenChoice(null);
  };

  const handleMakeChoice = (choice: ParadoxChoice) => {
    audio.playHoloBeep();
    setChosenChoice(choice);

    // Apply stability delta
    const nextStability = Math.max(10, Math.min(100, currentStability + choice.stabilityImpact));
    onStabilityChange(nextStability);

    if (choice.stabilityImpact < -30) {
      audio.playWormholeWarp();
    }
  };

  const handleResetTimeline = () => {
    audio.playClick();
    setChosenChoice(null);
    onStabilityChange(99.4);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 z-10 text-white space-y-8 select-none">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-red-500/30 backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>TEMPORAL INTEGRITY DEFENSE PROTOCOL</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">CHRONO-STABILITY:</span>
            <span
              className={`text-sm font-mono font-bold px-3 py-1 rounded-full border ${
                currentStability > 80
                  ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-400"
                  : currentStability > 50
                  ? "bg-amber-950/80 border-amber-500/50 text-amber-400"
                  : "bg-red-950/80 border-red-500/50 text-red-400 animate-pulse"
              }`}
            >
              {currentStability.toFixed(1)}%
            </span>
            <button
              onClick={handleResetTimeline}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition cursor-pointer"
              title="Reset Timeline Stability to 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
          PARADOX & BUTTERFLY SIMULATOR
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Manipulate high-leverage historical nexus forks. Observe how minor micro-interventions cascade through quantum probability manifolds and distort global stability.
        </p>

        {/* Scenario Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {PARADOX_SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? "bg-red-950/40 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-[11px] font-mono text-red-400 font-bold">
                  {sc.year < 0 ? `${Math.abs(sc.year)} BCE` : `${sc.year} CE`}
                </div>
                <div className="text-xs font-mono font-bold text-slate-200 line-clamp-1">
                  {sc.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Dilemma Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Historical Context */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            CANONICAL HISTORICAL BASELINE
          </span>

          <h2 className="text-2xl font-bold font-mono text-white">
            {selectedScenario.title}
          </h2>

          <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 uppercase font-mono block mb-1">NEXUS EVENT:</span>
              {selectedScenario.nexusEvent}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 uppercase font-mono block mb-1">
                ORIGINAL OUTCOME:
              </span>
              {selectedScenario.historicalOutcome}
            </div>
          </div>
        </div>

        {/* Right: Interactive Decision & Butterfly Consequence Engine */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-slate-950/90 border border-red-500/30 backdrop-blur-xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest">
              TEMPORAL INTERVENTION DILEMMA
            </span>
            <p className="text-base md:text-lg font-light text-slate-100 leading-relaxed">
              {selectedScenario.dilemma}
            </p>
          </div>

          {/* Decision Choices */}
          <div className="space-y-3">
            {selectedScenario.choices.map((choice) => {
              const isPicked = chosenChoice?.id === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => handleMakeChoice(choice)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isPicked
                      ? "bg-red-950/60 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isPicked ? "border-red-400 bg-red-500/30" : "border-slate-700"
                      }`}
                    >
                      {isPicked && <span className="w-2 h-2 rounded-full bg-red-400" />}
                    </span>
                    <span className="text-xs md:text-sm font-mono">{choice.text}</span>
                  </div>

                  <span
                    className={`text-xs font-mono shrink-0 ${
                      choice.stabilityImpact === 0
                        ? "text-emerald-400"
                        : choice.stabilityImpact > -30
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {choice.stabilityImpact === 0
                      ? "0% DRIFT"
                      : `${choice.stabilityImpact}% STABILITY`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Rendered Consequence & Paradox Anomaly */}
          {chosenChoice && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-red-500/40 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  BUTTERFLY EFFECT SIMULATION LOG
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {chosenChoice.divergenceNote}
                </span>
              </div>

              <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                {chosenChoice.butterflyConsequence}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
