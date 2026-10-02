import React, { useState, useEffect } from "react";
import { HISTORICAL_ERAS } from "../data/historicalData";
import { audio } from "../services/audioService";
import {
  Search,
  X,
  Zap,
  Sparkles,
  Calendar,
  MapPin,
  Cpu,
  User,
  ArrowRight,
} from "lucide-react";

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectYear: (year: number) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectYear,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          audio.playClick();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatYear = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  };

  const results = HISTORICAL_ERAS.filter((era) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      era.eraName.toLowerCase().includes(term) ||
      era.tagline.toLowerCase().includes(term) ||
      era.description.toLowerCase().includes(term) ||
      era.year.toString().includes(term) ||
      era.primaryLocation.toLowerCase().includes(term) ||
      era.events.some((ev) => ev.title.toLowerCase().includes(term) || ev.summary.toLowerCase().includes(term)) ||
      era.technologies.some((t) => t.name.toLowerCase().includes(term)) ||
      era.figures.some((f) => f.name.toLowerCase().includes(term))
    );
  });

  return (
    <div
      id="command-search-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-start justify-center pt-20 px-4 select-none"
    >
      <div className="relative w-full max-w-2xl bg-slate-950/95 border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-white flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center gap-3 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search any moment in human history (e.g. 1969, Einstein, Rome, Space, AI)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              NO TEMPORAL ARCHIVES MATCH YOUR QUERY. TRY SEARCHING BY YEAR OR FAMOUS FIGURES.
            </div>
          ) : (
            results.map((era) => (
              <button
                key={era.id || era.year}
                onClick={() => {
                  audio.playClick(1000);
                  onSelectYear(era.year);
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800/80 hover:border-cyan-400/60 transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                      {formatYear(era.year)}
                    </span>
                    <span className="text-sm font-mono font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {era.eraName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{era.tagline}</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <span>WARP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{results.length} TEMPORAL DESTINATIONS FOUND</span>
          <span>PRESS [ESC] TO CLOSE</span>
        </div>
      </div>
    </div>
  );
};
