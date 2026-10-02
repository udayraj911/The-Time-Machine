import React, { useState } from "react";
import { JourneyTheme, JourneyStep } from "../types";
import { HISTORICAL_JOURNEYS } from "../data/journeysData";
import { audio } from "../services/audioService";
import {
  Route,
  Cpu,
  Rocket,
  Compass,
  Navigation,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Zap,
  MapPin,
  Clock,
  Play,
} from "lucide-react";

interface JourneyModeProps {
  onWarpToYear: (year: number) => void;
}

export const JourneyMode: React.FC<JourneyModeProps> = ({ onWarpToYear }) => {
  const [selectedTheme, setSelectedTheme] = useState<JourneyTheme>(HISTORICAL_JOURNEYS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep: JourneyStep = selectedTheme.steps[activeStepIndex];

  const formatYear = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "Cpu":
        return Cpu;
      case "Rocket":
        return Rocket;
      case "Compass":
        return Compass;
      case "Navigation":
        return Navigation;
      case "Sparkles":
      default:
        return Sparkles;
    }
  };

  const handleSelectTheme = (theme: JourneyTheme) => {
    audio.playClick(800);
    setSelectedTheme(theme);
    setActiveStepIndex(0);
  };

  const handleStepChange = (idx: number) => {
    audio.playClick(900);
    setActiveStepIndex(idx);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 z-10 text-white space-y-8 select-none">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
          <Route className="w-4 h-4 text-cyan-400" />
          <span>GUIDED CHRONOLOGICAL EXPEDITIONS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
          JOURNEY THROUGH HISTORY
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Embark on structured temporal voyages tracing the evolution of humanity's greatest scientific, architectural, and philosophical achievements across centuries.
        </p>

        {/* Journey Theme Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
          {HISTORICAL_JOURNEYS.map((theme) => {
            const Icon = getIcon(theme.iconName);
            const isSelected = selectedTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${isSelected ? "text-cyan-400" : "text-slate-400"}`} />
                  <span className="text-[10px] font-mono text-slate-400">{theme.timeSpan}</span>
                </div>
                <span className={`text-xs font-mono font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>
                  {theme.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Journey Narrative Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Step Waypoints Navigator */}
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              TEMPORAL WAYPOINTS
            </span>
            <span className="text-xs font-mono text-slate-400">
              STEP {activeStepIndex + 1} OF {selectedTheme.steps.length}
            </span>
          </div>

          <div className="space-y-2">
            {selectedTheme.steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleStepChange(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-white shadow-lg"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-mono flex items-center justify-center font-bold ${
                        isActive
                          ? "bg-cyan-400 text-black shadow-[0_0_10px_#38bdf8]"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-mono font-bold">{formatYear(step.year)}</div>
                      <div className="text-[11px] text-slate-300 line-clamp-1">{step.title}</div>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Stage Cinematic Narrative Display */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-widest">
                TEMPORAL MILESTONE // {formatYear(activeStep.year)}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {activeStep.location}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black font-mono text-white">
              {activeStep.title}
            </h2>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs md:text-sm font-mono text-cyan-200">
              <span className="text-cyan-400 font-bold uppercase">CORE BREAKTHROUGH:</span>{" "}
              {activeStep.milestone}
            </div>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              {activeStep.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs md:text-sm font-mono text-slate-300">
              <span className="text-slate-400 uppercase">CIVILIZATIONAL IMPACT:</span>{" "}
              {activeStep.impact}
            </div>
          </div>

          {/* Navigation Controls & Direct Jump */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => handleStepChange(activeStepIndex - 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 disabled:opacity-30 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV STOP</span>
              </button>
              <button
                disabled={activeStepIndex === selectedTheme.steps.length - 1}
                onClick={() => handleStepChange(activeStepIndex + 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 disabled:opacity-30 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>NEXT STOP</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              id="journey-warp-btn"
              onClick={() => {
                audio.playClick(1000);
                onWarpToYear(activeStep.year);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>WARP TO YEAR {formatYear(activeStep.year)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
