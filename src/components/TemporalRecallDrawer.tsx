import React, { useState } from "react";
import { TemporalSnapshot, TemporalMission } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../services/audioService";
import {
  X,
  History,
  Award,
  Clock,
  MapPin,
  Zap,
  CheckCircle2,
  Lock,
  Compass,
  Calendar,
  AlertCircle
} from "lucide-react";

interface TemporalRecallDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: TemporalSnapshot[];
  missions: TemporalMission[];
  onWarpToYear: (year: number) => void;
  onClearSnapshots?: () => void;
}

export const TemporalRecallDrawer: React.FC<TemporalRecallDrawerProps> = ({
  isOpen,
  onClose,
  snapshots,
  missions,
  onWarpToYear,
  onClearSnapshots,
}) => {
  const [activeTab, setActiveTab] = useState<"LOGS" | "MISSIONS">("LOGS");

  const formatYear = (yr: number) => {
    const abs = Math.abs(yr);
    if (abs >= 1000000000) return `${(abs / 1000000000).toFixed(1)}B Yrs Ago`;
    if (abs >= 1000000) return `${(abs / 1000000).toFixed(0)}M Yrs Ago`;
    if (abs >= 10000) return `${(abs / 1000).toFixed(0)}K Yrs Ago`;
    return yr < 0 ? `${abs} BC` : `${yr} CE`;
  };

  const completedCount = missions.filter((m) => m.isCompleted).length;
  const completionRate = Math.round((completedCount / missions.length) * 100) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Left slide out Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed inset-y-0 left-0 z-50 w-full sm:w-[480px] bg-slate-950/95 border-r border-cyan-500/30 backdrop-blur-2xl text-white flex flex-col shadow-[10px_0_40px_rgba(0,0,0,0.8)]"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-cyan-950/20">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center">
                  <History className="w-5 h-5 text-cyan-300 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-mono font-bold text-sm tracking-wider text-white">
                    CHRONO RECALL MATRIX
                  </h2>
                  <p className="text-[11px] font-mono text-cyan-300/70">
                    FLUX LOGS & MISSION LOGISTICS
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  audio.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50">
              <button
                onClick={() => {
                  audio.playClick(700);
                  setActiveTab("LOGS");
                }}
                className={`flex-1 py-3 text-xs font-mono font-bold tracking-wider border-b-2 flex items-center justify-center gap-2 transition ${
                  activeTab === "LOGS"
                    ? "border-cyan-500 text-cyan-300 bg-cyan-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>FLUX LOGS ({snapshots.length})</span>
              </button>

              <button
                onClick={() => {
                  audio.playClick(750);
                  setActiveTab("MISSIONS");
                }}
                className={`flex-1 py-3 text-xs font-mono font-bold tracking-wider border-b-2 flex items-center justify-center gap-2 transition ${
                  activeTab === "MISSIONS"
                    ? "border-purple-500 text-purple-300 bg-purple-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>MISSIONS ({completedCount}/{missions.length})</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20">
              {activeTab === "LOGS" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      CHRONOLOGICAL TRAVEL HISTORY
                    </span>
                    {onClearSnapshots && snapshots.length > 0 && (
                      <button
                        onClick={() => {
                          audio.playClick(600);
                          onClearSnapshots();
                        }}
                        className="text-[10px] font-mono text-rose-400/80 hover:text-rose-400 hover:underline transition cursor-pointer"
                      >
                        PURGE ARCHIVES
                      </button>
                    )}
                  </div>

                  {snapshots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                      <Compass className="w-8 h-8 text-slate-600 mb-3 animate-spin" style={{ animationDuration: "12s" }} />
                      <p className="text-xs font-mono text-slate-400">NO FLUX SNAPSHOTS RECORDED</p>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[240px]">
                        Initiate a wormhole time jump using the primary controls to log temporal positions.
                      </p>
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-cyan-500/20 pl-4 ml-2 space-y-4">
                      {snapshots.map((snap, idx) => (
                        <motion.div
                          key={snap.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative group bg-slate-900/75 border border-slate-800 hover:border-cyan-500/30 p-3.5 rounded-xl transition shadow-sm"
                        >
                          {/* Left dot connection */}
                          <div className="absolute -left-[23px] top-[18px] w-2 h-2 rounded-full bg-cyan-400 border border-slate-950 group-hover:scale-125 transition-transform" />

                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-xs text-white">
                                  {formatYear(snap.year)}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-500/20">
                                  {snap.eraName.split(" ")[0]}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-slate-300 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                <span className="truncate max-w-[200px]">{snap.locationName}</span>
                              </p>
                              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed italic">
                                "{snap.notes}"
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                audio.playClick(1100);
                                onWarpToYear(snap.year);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                              title="Re-warp to this coordinates"
                            >
                              <Zap className="w-3 h-3 fill-black" />
                              <span>WARP</span>
                            </button>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono text-slate-500">
                            <span>COSMIC TELEMETRY: OK</span>
                            <span>{new Date(snap.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "MISSIONS" && (
                <div className="space-y-4">
                  {/* Progress overview card */}
                  <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                        TEMPORAL COMPLETION RATE
                      </span>
                      <h3 className="text-2xl font-mono font-black text-white mt-1">
                        {completionRate}%
                      </h3>
                      <p className="text-[10px] text-purple-200/70 mt-1">
                        {completedCount} of {missions.length} chronos missions completed
                      </p>
                    </div>

                    <div className="relative w-14 h-14 rounded-full border-4 border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-purple-300">
                      <div
                        className="absolute inset-0 rounded-full border-4 border-purple-500"
                        style={{
                          clipPath: `polygon(50% 50%, -50% -50%, ${completionRate >= 25 ? "150% -50%" : "50% -50%"}, ${completionRate >= 50 ? "150% 150%" : "50% -50%"}, ${completionRate >= 75 ? "-50% 150%" : "50% -50%"}, ${completionRate >= 100 ? "-50% -50%" : "50% -50%"})`,
                          transform: "rotate(45deg)",
                        }}
                      />
                      <span>{completedCount}/{missions.length}</span>
                    </div>
                  </div>

                  {/* List of missions */}
                  <div className="space-y-3">
                    {missions.map((mission, idx) => (
                      <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`border p-3.5 rounded-xl transition-all ${
                          mission.isCompleted
                            ? "bg-purple-950/20 border-purple-500/30"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-lg border ${
                              mission.isCompleted
                                ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
                                : "bg-slate-950 border-slate-700 text-slate-500"
                            }`}>
                              {mission.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-purple-300" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className={`text-xs font-mono font-bold ${mission.isCompleted ? "text-purple-300" : "text-slate-200"}`}>
                                  {mission.title}
                                </h4>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                  mission.isCompleted
                                    ? "bg-purple-900/50 text-purple-200 border border-purple-500/20"
                                    : "bg-slate-800 text-slate-400"
                                }`}>
                                  {mission.badgeName}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                                {mission.objective}
                              </p>
                              <div className="mt-2.5 flex items-center gap-3 text-[10px] font-mono text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-purple-500/70" />
                                  Target: {formatYear(mission.targetYear)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-purple-500/70" />
                                  {mission.targetLocation}
                                </span>
                              </div>
                            </div>
                          </div>

                          {!mission.isCompleted && (
                            <button
                              onClick={() => {
                                audio.playClick(1000);
                                onWarpToYear(mission.targetYear);
                                onClose();
                              }}
                              className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-[10px] flex items-center gap-1 transition cursor-pointer flex-shrink-0"
                              title="Warp directly to complete objective"
                            >
                              <Zap className="w-3 h-3 fill-white" />
                              <span>JUMP</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
