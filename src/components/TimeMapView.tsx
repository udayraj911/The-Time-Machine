import React, { useState } from "react";
import { HISTORICAL_ERAS } from "../data/historicalData";
import { HistoricalEra } from "../types";
import { audio } from "../services/audioService";
import { TemporalOrb } from "./3d/TemporalOrb";
import {
  Globe,
  MapPin,
  Zap,
  Filter,
  Layers,
  Sparkles,
  Compass,
  ArrowRight,
} from "lucide-react";

interface TimeMapViewProps {
  onWarpToYear: (year: number) => void;
}

export const TimeMapView: React.FC<TimeMapViewProps> = ({ onWarpToYear }) => {
  const [selectedEra, setSelectedEra] = useState<HistoricalEra>(HISTORICAL_ERAS[0]);
  const [filterTag, setFilterTag] = useState<string>("ALL");

  const tags = ["ALL", "ANCIENT", "CLASSICAL", "MEDIEVAL", "RENAISSANCE", "MODERN", "SPACE_AGE", "FUTURE"];

  const filteredEras =
    filterTag === "ALL"
      ? HISTORICAL_ERAS
      : HISTORICAL_ERAS.filter((e) => e.epochTag.toUpperCase().includes(filterTag));

  const formatYear = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 z-10 text-white space-y-8 select-none">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>SPATIO-TEMPORAL CARTOGRAPHY MATRIX</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white">
          GLOBAL TIME MAP
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Navigate Earth's coordinates across millenia. Pinpoint where major revolutions, philosophical breakthroughs, and industrial transformations erupted across the globe.
        </p>

        {/* Epoch Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-800 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {tags.map((tag) => {
            const isSelected = filterTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  audio.playClick(800);
                  setFilterTag(tag);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map & Coordinates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 3D Holographic Globe */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl flex flex-col justify-between min-h-[440px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 tracking-wider">
              HOLOGRAPHIC GEO-ORB // DRAG TO ROTATE
            </span>
            <span className="text-xs font-mono text-slate-400">
              TARGET: {selectedEra.primaryLocation}
            </span>
          </div>

          <div className="w-full h-80 relative flex items-center justify-center">
            <TemporalOrb
              currentYear={selectedEra.year}
              highlightCoordinates={selectedEra.coordinates}
              locationName={selectedEra.primaryLocation}
              themeColor={selectedEra.atmosphereColor}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
            <div>
              COORDINATES:{" "}
              <span className="text-white">
                {selectedEra.coordinates?.[0].toFixed(2)}°N, {selectedEra.coordinates?.[1].toFixed(2)}°E
              </span>
            </div>
            <button
              onClick={() => {
                audio.playClick(1000);
                onWarpToYear(selectedEra.year);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>WARP TO THIS LOCATION ({formatYear(selectedEra.year)})</span>
            </button>
          </div>
        </div>

        {/* Right: Global Coordinate Beacons List */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl space-y-4 max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
              REGISTERED TEMPORAL NEXUS PINS ({filteredEras.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredEras.map((era) => {
              const isSelected = selectedEra.year === era.year;
              return (
                <div
                  key={era.id || era.year}
                  onClick={() => {
                    audio.playClick(900);
                    setSelectedEra(era);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? "bg-cyan-950/50 border-cyan-400 shadow-md"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {formatYear(era.year)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {era.primaryLocation}
                    </span>
                  </div>

                  <div className="text-sm font-mono font-bold text-white">{era.eraName}</div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {era.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                    <span className="uppercase text-cyan-300">{era.dominantPower}</span>
                    <span className="text-cyan-400 flex items-center gap-1 hover:underline">
                      SELECT PIN <ArrowRight className="w-3 h-3" />
                    </span>
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
