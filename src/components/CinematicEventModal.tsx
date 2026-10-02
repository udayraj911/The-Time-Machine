import React, { useState, useEffect } from "react";
import { HistoricalEvent } from "../types";
import { fetchHistoricalDeepDive } from "../services/apiService";
import { audio } from "../services/audioService";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MapPin,
  Calendar,
  Users,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Bot,
  Layers,
} from "lucide-react";

interface CinematicEventModalProps {
  event: HistoricalEvent | null;
  onClose: () => void;
  onJumpToYear?: (year: number) => void;
  onAskOrion: (query: string) => void;
}

export const CinematicEventModal: React.FC<CinematicEventModalProps> = ({
  event,
  onClose,
  onJumpToYear,
  onAskOrion,
}) => {
  const [deepDiveData, setDeepDiveData] = useState<any>(null);
  const [isLoadingDeepDive, setIsLoadingDeepDive] = useState<boolean>(false);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  useEffect(() => {
    if (!event) return;

    // Load AI deep dive dossier
    setIsLoadingDeepDive(true);
    fetchHistoricalDeepDive(event.title, event.year, event.detailedNarrative)
      .then((data) => {
        setDeepDiveData(data);
      })
      .finally(() => {
        setIsLoadingDeepDive(false);
      });

    return () => {
      // cancel speech synthesis if running
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [event]);

  if (!event) return null;

  const formatYear = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  };

  const handleNarrate = () => {
    if (!("speechSynthesis" in window)) return;

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    const textToRead = `${event.title}. ${event.dateStr || formatYear(event.year)}. Location: ${event.location}. ${event.detailedNarrative}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      id="cinematic-event-scene"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8 select-none overflow-y-auto"
    >
      {/* Background cinematic particle lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[140px]"
        />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between pb-6 border-b border-cyan-500/20 text-slate-400">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono tracking-widest text-cyan-300">
            CINEMATIC ARCHIVAL STAGE // SEC-09
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Narration Toggle */}
          {"speechSynthesis" in window && (
            <button
              onClick={handleNarrate}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                isNarrating
                  ? "bg-cyan-500 text-black font-bold animate-pulse"
                  : "bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isNarrating ? "STOP NARRATION" : "NARRATE SCENE"}</span>
            </button>
          )}

          {/* Close Modal */}
          <button
            id="close-event-modal-btn"
            onClick={() => {
              audio.playClick();
              if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close Scene (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Scene Body */}
      <div className="relative z-10 w-full max-w-5xl py-8 space-y-8">
        {/* Date & Epoch Callout */}
        <div className="space-y-2">
          <p className="text-sm md:text-base font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold">
            {event.dateStr || `YEAR ${formatYear(event.year)}`}
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
            {event.title.toUpperCase()}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{event.location}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Award className="w-4 h-4" />
              <span>IMPACT INDEX: {event.impactScore}/100</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-purple-300">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase">CATEGORY: {event.category}</span>
            </div>
          </div>
        </div>

        {/* Hero Narrative Block */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <p className="text-base md:text-xl font-light text-slate-100 leading-relaxed">
            {event.detailedNarrative}
          </p>

          {event.quote && (
            <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 font-mono text-sm md:text-base text-cyan-200 italic space-y-2">
              <p>"{event.quote.text}"</p>
              <p className="text-xs text-cyan-400 not-italic font-bold text-right">
                — {event.quote.author}
              </p>
            </div>
          )}

          {/* Key Historical Figures */}
          {event.keyFigures && event.keyFigures.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>KEY HISTORICAL FIGURES IN THIS SCENE</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.keyFigures.map((fig, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAskOrion(`What was the role of ${fig} during ${event.title}?`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/50 text-xs font-mono text-slate-200 hover:text-purple-200 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>{fig}</span>
                    <Bot className="w-3 h-3 text-purple-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Archival Deep-Dive Section */}
        {deepDiveData && (
          <div className="p-6 md:p-8 rounded-3xl bg-purple-950/20 border border-purple-500/30 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-mono text-xs tracking-widest font-bold">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>ORION TEMPORAL DEEP-DIVE DOSSIER</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-500/30">
                AI REASONING ENHANCED
              </span>
            </div>

            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              {deepDiveData.narrative}
            </p>

            {deepDiveData.unseenDetails && deepDiveData.unseenDetails.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-mono text-cyan-300 uppercase tracking-wider">
                  ARCHIVAL NUANCES & UNSEEN HISTORICAL FACTORS:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {deepDiveData.unseenDetails.map((detail: string, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-950/60 border border-purple-500/20 text-xs text-slate-300 leading-relaxed"
                    >
                      • {detail}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {deepDiveData.globalEcho && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-purple-200">
                <span className="text-slate-400 uppercase">LONG-TERM TEMPORAL ECHO:</span>{" "}
                {deepDiveData.globalEcho}
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            onClick={() => onAskOrion(`Tell me about the global consequences of ${event.title} in Year ${event.year}.`)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-xs font-mono text-purple-200 transition cursor-pointer"
          >
            <Bot className="w-4 h-4 text-purple-300" />
            <span>DISCUSS WITH ORION AI</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider transition cursor-pointer"
          >
            RETURN TO COCKPIT
          </button>
        </div>
      </div>
    </div>
  );
};
