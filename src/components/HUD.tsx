import React from "react";
import { AppMode } from "../types";
import { audio } from "../services/audioService";
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  GitFork,
  AlertTriangle,
  Archive,
  Volume2,
  VolumeX,
  Search,
  Bot,
  Zap,
  Globe,
  Route,
  Home,
  History,
} from "lucide-react";

interface HUDProps {
  currentYear: number;
  originYear?: number;
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onGoHome?: () => void;
  onOpenSearch: () => void;
  onToggleOrion: () => void;
  isOrionOpen: boolean;
  onToggleRecall: () => void;
  isRecallOpen: boolean;
  onInitiateTravel: () => void;
  stabilityPercent?: number;
  locationLabel?: string;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  currentYear,
  originYear = 2026,
  activeMode,
  onModeChange,
  onGoHome,
  onOpenSearch,
  onToggleOrion,
  isOrionOpen,
  onToggleRecall,
  isRecallOpen,
  onInitiateTravel,
  stabilityPercent = 99.4,
  locationLabel = "Sector Earth",
  isSoundMuted,
  onToggleSound,
}) => {
  const temporalDistance = currentYear - originYear;
  const isFuture = currentYear > originYear;
  const distanceLabel =
    temporalDistance === 0
      ? "PRESENT ORIGIN"
      : temporalDistance > 0
      ? `+${temporalDistance} YRS (FUTURE)`
      : `${temporalDistance} YRS (PAST)`;

  const yearDisplay = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  };

  const navModes: { mode: AppMode; label: string; icon: any }[] = [
    { mode: "EXPLORE", label: "Era Museum", icon: Compass },
    { mode: "JOURNEY", label: "Journeys", icon: Route },
    { mode: "TIME_MAP", label: "Time Map", icon: Globe },
    { mode: "INSIDE_EARTH", label: "Inside Earth", icon: Globe },
    { mode: "FUTURE", label: "Future 2100+", icon: Sparkles },
    { mode: "WHAT_IF", label: "What If?", icon: GitFork },
    { mode: "PARADOX", label: "Paradoxes", icon: AlertTriangle },
    { mode: "CAPSULE", label: "Time Capsule", icon: Archive },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Telemetry Cluster */}
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-start">
          {/* Logo & Year Status (Clickable to Home) */}
          <button
            id="hud-brand-home-btn"
            onClick={() => {
              if (onGoHome) {
                audio.playClick();
                onGoHome();
              }
            }}
            className="flex items-center gap-3 text-left hover:opacity-90 transition cursor-pointer group"
            title="Return to Home Gateway"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  CHRONOS
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-mono border border-cyan-500/30">
                  HUD v3.4
                </span>
              </div>
              <div className="text-lg font-mono font-black text-white flex items-center gap-2">
                <span>{yearDisplay(currentYear)}</span>
                <span className="text-[11px] font-normal text-slate-400 font-sans">
                  ({distanceLabel})
                </span>
              </div>
            </div>
          </button>

          {/* Quick Home Gateway Button */}
          {onGoHome && (
            <button
              id="hud-home-btn"
              onClick={() => {
                audio.playClick();
                onGoHome();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/70 border border-slate-700/80 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-cyan-300 transition cursor-pointer shadow-sm"
              title="Return to Launch Gateway / Home"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">HOME</span>
            </button>
          )}

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400">STABILITY:</span>{" "}
              <span
                className={`font-bold ${
                  stabilityPercent > 80
                    ? "text-emerald-400"
                    : stabilityPercent > 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {stabilityPercent.toFixed(1)}%
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400">LOC:</span>{" "}
              <span className="text-cyan-300">{locationLabel}</span>
            </div>
          </div>
        </div>

        {/* Center Mode Selector */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full py-1 scrollbar-none">
          {navModes.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  audio.playClick();
                  onModeChange(item.mode);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Quick Search */}
          <button
            id="hud-search-btn"
            onClick={() => {
              audio.playClick();
              onOpenSearch();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-slate-300 transition cursor-pointer"
            title="Search Temporal Archives (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SEARCH ARCHIVE</span>
          </button>

          {/* CHRONO RECALL Toggle */}
          <button
            id="hud-recall-toggle"
            onClick={() => {
              audio.playHoloBeep();
              onToggleRecall();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              isRecallOpen
                ? "bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                : "bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/50"
            }`}
          >
            <History className="w-3.5 h-3.5 text-cyan-300" />
            <span>CHRONO RECALL</span>
          </button>

          {/* TEMPUS AI Guide Toggle */}
          <button
            id="hud-tempus-toggle"
            onClick={() => {
              audio.playHoloBeep();
              onToggleOrion();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              isOrionOpen
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                : "bg-slate-900/90 border border-purple-500/40 text-purple-300 hover:bg-purple-950/50"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span>TEMPUS AI</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="hud-audio-toggle"
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
            title={isSoundMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isSoundMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Initiate Time Travel Big Trigger */}
          <button
            id="hud-initiate-travel"
            onClick={() => {
              audio.playClick(1000);
              onInitiateTravel();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>WARP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
