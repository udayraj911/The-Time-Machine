import React, { useState, useEffect } from "react";
import { TimeCapsule } from "../types";
import { audio } from "../services/audioService";
import {
  Archive,
  Lock,
  Unlock,
  Key,
  Calendar,
  Send,
  Sparkles,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface TimeCapsuleModeProps {
  currentYear: number;
  onWarpToYear: (year: number) => void;
}

export const TimeCapsuleMode: React.FC<TimeCapsuleModeProps> = ({
  currentYear,
  onWarpToYear,
}) => {
  const [capsules, setCapsules] = useState<TimeCapsule[]>(() => {
    try {
      const saved = localStorage.getItem("chronos_time_capsules");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "default-capsule-1",
        creatorName: "Temporal Explorer Alpha",
        creationYear: 2026,
        targetUnlockYear: 2100,
        message:
          "To the citizens of 2100: Remember that our century was when humanity balanced AI cognitive collaboration with planetary ecological regeneration.",
        favoriteEras: [1969, 1905, -2560],
        predictionForFuture:
          "Zero-point energy grid deployed across the solar system and synthetic neural interfaces standard.",
        sealedAt: Date.now() - 86400000,
        isSealed: true,
      },
    ];
  });

  const [creatorName, setCreatorName] = useState<string>("");
  const [targetUnlockYear, setTargetUnlockYear] = useState<number>(2100);
  const [message, setMessage] = useState<string>("");
  const [prediction, setPrediction] = useState<string>("");
  const [isSuccessSealed, setIsSuccessSealed] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("chronos_time_capsules", JSON.stringify(capsules));
    } catch {}
  }, [capsules]);

  const handleSealCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    audio.playWormholeWarp();

    const newCapsule: TimeCapsule = {
      id: `capsule-${Date.now()}`,
      creatorName: creatorName.trim() || "Anonymous Traveler",
      creationYear: currentYear,
      targetUnlockYear,
      message: message.trim(),
      favoriteEras: [currentYear],
      predictionForFuture: prediction.trim() || undefined,
      sealedAt: Date.now(),
      isSealed: true,
    };

    setCapsules((prev) => [newCapsule, ...prev]);
    setMessage("");
    setPrediction("");
    setCreatorName("");
    setIsSuccessSealed(true);

    setTimeout(() => {
      setIsSuccessSealed(false);
    }, 4000);
  };

  const handleDelete = (id: string) => {
    audio.playClick(600);
    setCapsules((prev) => prev.filter((c) => c.id !== id));
  };

  const formatYear = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 z-10 text-white space-y-8 select-none">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
          <Archive className="w-4 h-4 text-emerald-400" />
          <span>CRYPTOGRAPHIC TEMPORAL VAULT</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
          PERSONAL TIME CAPSULE
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Inscribe personal artifacts, philosophical reflections, and forward predictions. Seal them with immutable temporal quantum hashes destined for future civilizations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Capsule Forge Form */}
        <form
          onSubmit={handleSealCapsule}
          className="lg:col-span-6 p-6 md:p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              FORGE NEW TIME CAPSULE
            </span>
            <span className="text-xs font-mono text-slate-400">
              ORIGIN: {formatYear(currentYear)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">
                TRAVELER / AUTHOR:
              </label>
              <input
                type="text"
                placeholder="e.g. Commander Sarah Chen"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white focus:outline-none font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">
                TARGET UNLOCK YEAR:
              </label>
              <input
                type="number"
                min={2026}
                max={5000}
                value={targetUnlockYear}
                onChange={(e) => setTargetUnlockYear(parseInt(e.target.value, 10) || 2100)}
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase">
              MESSAGE TO THE FUTURE (PHILOSOPHY / ARTIFACT):
            </label>
            <textarea
              rows={4}
              required
              placeholder="What wisdom, truth, or memory do you wish to transmit to people of that distant century?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-400 rounded-xl p-3.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none font-sans leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase">
              FORWARD PREDICTION FOR THAT ERA:
            </label>
            <input
              type="text"
              placeholder="e.g. Humanity will have settled the moons of Jupiter."
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition cursor-pointer"
          >
            <Lock className="w-4 h-4 fill-black" />
            <span>SEAL CAPSULE IN TEMPORAL MATRIX</span>
          </button>

          {isSuccessSealed && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CAPSULE CRYPTOGRAPHICALLY SECURED & EMBEDDED IN REPOSITORY.</span>
            </div>
          )}
        </form>

        {/* Right: Vault of Sealed Capsules */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              SEALED REPOSITORY VAULT ({capsules.length})
            </span>
          </div>

          <div className="space-y-4 max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/20">
            {capsules.map((cap) => {
              const isUnlocked = currentYear >= cap.targetUnlockYear;
              return (
                <div
                  key={cap.id}
                  className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 backdrop-blur-xl transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                          <Unlock className="w-3 h-3" /> UNLOCKED (ERA REACHED)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                          <Lock className="w-3 h-3 text-amber-400" /> SEALED UNTIL {formatYear(cap.targetUnlockYear)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(cap.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition cursor-pointer"
                      title="Purge Capsule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs font-mono text-slate-400">
                    AUTHOR: <span className="text-white font-bold">{cap.creatorName}</span> •
                    SEALED AT: {formatYear(cap.creationYear)}
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed italic bg-black/40 p-3.5 rounded-xl border border-slate-800">
                    "{cap.message}"
                  </p>

                  {cap.predictionForFuture && (
                    <div className="text-xs font-mono text-emerald-300/90">
                      <span className="text-slate-400 uppercase">PREDICTION:</span>{" "}
                      {cap.predictionForFuture}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 text-[11px]">
                      DESTINATION: {formatYear(cap.targetUnlockYear)}
                    </span>
                    <button
                      onClick={() => {
                        audio.playClick(1000);
                        onWarpToYear(cap.targetUnlockYear);
                      }}
                      className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>WARP TO UNLOCK ERA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
