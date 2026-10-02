import React, { useState } from "react";
import { HistoricalEra, HistoricalEvent, TechArtifact, HistoricalFigure } from "../types";
import { audio } from "../services/audioService";
import { TemporalOrb } from "./3d/TemporalOrb";
import {
  Sparkles,
  Cpu,
  User,
  Radio,
  BookOpen,
  Volume2,
  Calendar,
  MapPin,
  Flame,
  ArrowUpRight,
  Maximize2,
  Bot,
  Layers,
} from "lucide-react";

interface EraMuseumViewProps {
  era: HistoricalEra;
  onSelectEvent: (event: HistoricalEvent) => void;
  onAskOrionAboutTopic: (topic: string) => void;
}

export const EraMuseumView: React.FC<EraMuseumViewProps> = ({
  era,
  onSelectEvent,
  onAskOrionAboutTopic,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "tech" | "figures" | "culture">(
    "overview"
  );

  const formatYear = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 z-10 text-white">
      {/* Top Era Banner & Spatial Title */}
      <div className="relative mb-8 p-6 md:p-8 rounded-3xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Subtle accent glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: era.atmosphereColor || "#06b6d4" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Hero Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
                {era.epochTag.replace("_", " ")}
              </span>
              <span className="text-xs font-mono text-slate-400">
                TEMPORAL COORDINATE: {formatYear(era.year)}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              {era.eraName}
            </h1>

            <p className="text-base md:text-lg font-light text-cyan-200/90 leading-relaxed max-w-2xl">
              {era.tagline}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {era.description}
            </p>

            {/* Environmental Sensor Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400">
              {era.populationEstimate && (
                <div className="bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">POPULATION:</span>{" "}
                  <span className="text-white font-bold">{era.populationEstimate}</span>
                </div>
              )}
              {era.dominantPower && (
                <div className="bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">POWER:</span>{" "}
                  <span className="text-cyan-300">{era.dominantPower}</span>
                </div>
              )}
              {era.soundscapeMood && (
                <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{era.soundscapeMood}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Holographic Chrono Orb */}
          <div className="w-full h-64 md:h-72 rounded-2xl bg-black/40 border border-slate-800/80 p-2 flex items-center justify-center relative overflow-hidden">
            <TemporalOrb
              currentYear={era.year}
              highlightCoordinates={era.coordinates}
              locationName={era.primaryLocation}
              themeColor={era.atmosphereColor}
            />
          </div>
        </div>

        {/* Museum Category Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Archive Dossier", icon: BookOpen },
            { id: "events", label: `Nexus Events (${era.events?.length || 0})`, icon: Sparkles },
            { id: "tech", label: `Inventions & Tech (${era.technologies?.length || 0})`, icon: Cpu },
            { id: "figures", label: `Key Figures (${era.figures?.length || 0})`, icon: User },
            { id: "culture", label: "Culture & Life", icon: Radio },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audio.playClick(900);
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. OVERVIEW & IMMERSIVE HIGHLIGHTS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Featured Event Card */}
          {era.events && era.events[0] && (
            <div
              onClick={() => {
                audio.playHoloBeep();
                onSelectEvent(era.events[0]);
              }}
              className="md:col-span-2 group relative p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer backdrop-blur-xl shadow-xl hover:shadow-[0_0_35px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  PRIMARY NEXUS EVENT
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 group-hover:text-cyan-300 transition-colors" />
                  CLICK TO ENTER SCENE
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold font-mono text-white mb-2 group-hover:text-cyan-200 transition-colors">
                {era.events[0].title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {era.events[0].detailedNarrative}
              </p>

              {era.events[0].quote && (
                <blockquote className="border-l-2 border-cyan-500 pl-4 py-1 text-xs text-cyan-200/90 italic font-mono bg-cyan-950/30 rounded-r-lg">
                  "{era.events[0].quote.text}" — {era.events[0].quote.author}
                </blockquote>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{era.events[0].location}</span>
                </div>
                <div className="text-cyan-300 font-bold">
                  IMPACT INDEX: {era.events[0].impactScore}/100
                </div>
              </div>
            </div>
          )}

          {/* Quick AI Deep Dive Assistant Box */}
          <div className="p-6 rounded-2xl bg-purple-950/30 border border-purple-500/30 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-mono font-bold tracking-wider">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>ORION ARCHIVAL QUERY</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Explore Year {formatYear(era.year)} with AI
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ask ORION to analyze geopolitical dynamics, technological innovations, or daily human life during this exact temporal point.
              </p>
            </div>

            <div className="space-y-2 mt-6">
              <button
                onClick={() =>
                  onAskOrionAboutTopic(`What were the daily living conditions and culture like in ${formatYear(era.year)}?`)
                }
                className="w-full text-left px-3 py-2 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 border border-purple-500/30 text-xs font-mono text-purple-200 transition flex items-center justify-between cursor-pointer"
              >
                <span>Daily Life & Culture</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  onAskOrionAboutTopic(`What were the most important technological inventions of ${formatYear(era.year)}?`)
                }
                className="w-full text-left px-3 py-2 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 border border-purple-500/30 text-xs font-mono text-purple-200 transition flex items-center justify-between cursor-pointer"
              >
                <span>Technological Breakthroughs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. NEXUS EVENTS LIST */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {era.events?.map((ev) => (
            <div
              key={ev.id}
              onClick={() => {
                audio.playHoloBeep();
                onSelectEvent(ev);
              }}
              className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer backdrop-blur-xl"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-cyan-400 font-bold">{ev.dateStr || formatYear(ev.year)}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                  {ev.category}
                </span>
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {ev.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{ev.summary}</p>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {ev.location}
                </span>
                <span className="text-cyan-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  ENTER SCENE <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. INVENTIONS & TECHNOLOGIES */}
      {activeTab === "tech" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {era.technologies?.map((tech) => (
            <div
              key={tech.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 backdrop-blur-xl transition"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-emerald-400 font-bold">{tech.category}</span>
                <span>{tech.inventor ? `Inventor: ${tech.inventor}` : "State / Collective"}</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-2">{tech.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">{tech.description}</p>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-emerald-300/90">
                <span className="text-slate-400">HISTORICAL IMPACT:</span> {tech.significance}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. HISTORICAL FIGURES */}
      {activeTab === "figures" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {era.figures?.map((fig) => (
            <div
              key={fig.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 backdrop-blur-xl transition"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-sky-400 font-bold">{fig.role}</span>
                <span>{fig.yearsAlive}</span>
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-2">{fig.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">{fig.bio}</p>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-sky-300/90">
                <span className="text-slate-400">LEGACY:</span> {fig.keyContribution}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. CULTURE & SOCIETY */}
      {activeTab === "culture" && (
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-6">
          <h3 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Cultural Atmosphere & Everyday Reality ({formatYear(era.year)})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {era.cultureHighlights?.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300 leading-relaxed flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-300">
              Curious about music, food, or philosophy in {formatYear(era.year)}?
            </div>
            <button
              onClick={() =>
                onAskOrionAboutTopic(`Describe what music, food, and daily conversation felt like in ${formatYear(era.year)}.`)
              }
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>ORION AUDIO SENSORY SIMULATION</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
