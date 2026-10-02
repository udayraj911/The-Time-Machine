import React, { useState } from "react";
import { AppMode, HistoricalEvent, HistoricalEra, TemporalSnapshot, TemporalMission } from "./types";
import { getEraByYear } from "./data/historicalData";
import { audio } from "./services/audioService";
import { WormholeScene } from "./components/3d/WormholeScene";
import { IntroCinematic } from "./components/IntroCinematic";
import { HUD } from "./components/HUD";
import { TimelineNav } from "./components/TimelineNav";
import { EraMuseumView } from "./components/EraMuseumView";
import { CinematicEventModal } from "./components/CinematicEventModal";
import { OrionAssistant } from "./components/OrionAssistant";
import { JourneyMode } from "./components/JourneyMode";
import { FutureMode } from "./components/FutureMode";
import { WhatIfMode } from "./components/WhatIfMode";
import { ParadoxSimulator } from "./components/ParadoxSimulator";
import { TimeMapView } from "./components/TimeMapView";
import { TimeCapsuleMode } from "./components/TimeCapsuleMode";
import { CommandSearchModal } from "./components/CommandSearchModal";
import { WormholeTransition } from "./components/WormholeTransition";
import { TemporalRecallDrawer } from "./components/TemporalRecallDrawer";
import { InsideEarthExploration } from "./components/InsideEarthExploration";

const INITIAL_MISSIONS: TemporalMission[] = [
  {
    id: "m-bigbang",
    title: "Cosmic Genesis",
    targetYear: -13800000000,
    targetLocation: "Cosmic Singularity",
    objective: "Witness the cosmic dawn of the Big Bang and register singularity coordinates.",
    isCompleted: false,
    badgeName: "PRIMORDIAL COGNITION",
  },
  {
    id: "m-hadean",
    title: "Primordial Crucible",
    targetYear: -4500000000,
    targetLocation: "Molten Crust",
    objective: "Observe the volatile cooling phase of Hadean Earth's sulfur ocean.",
    isCompleted: false,
    badgeName: "CRUST DECODER",
  },
  {
    id: "m-dinosaur",
    title: "Cretaceous Extinction",
    targetYear: -250000000,
    targetLocation: "Pangaea Supercontinent",
    objective: "Walk alongside the apex dinosaurs before the Chixculub impactor event.",
    isCompleted: false,
    badgeName: "SAURIAN WITNESS",
  },
  {
    id: "m-iceage",
    title: "The Great Glaciation",
    targetYear: -20000,
    targetLocation: "Northern Glacial Margin",
    objective: "Investigate frozen landscapes and early human survival during the Ice Age.",
    isCompleted: false,
    badgeName: "BOREAL EXPLORER",
  },
  {
    id: "m-giza",
    title: "Dawn of Civilization",
    targetYear: -2560,
    targetLocation: "Giza Plateau, Egypt",
    objective: "Verify construction alignments of the Great Pyramid of Khufu.",
    isCompleted: false,
    badgeName: "PHARAONIC GEOMETRICIAN",
  },
  {
    id: "m-apollo",
    title: "Lunar Leaps",
    targetYear: 1969,
    targetLocation: "Sea of Tranquility",
    objective: "Observe the historic Apollo 11 Lunar Module landing.",
    isCompleted: false,
    badgeName: "LUNAR CHRONO-WITNESS",
  },
  {
    id: "m-future",
    title: "Neural Horizon",
    targetYear: 2100,
    targetLocation: "Planetary Arcologies",
    objective: "Simulate speculative post-carbon civilization parameters.",
    isCompleted: false,
    badgeName: "PROPHET MATRIX",
  },
];

export function App() {
  const [hasEnteredTimeline, setHasEnteredTimeline] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [activeMode, setActiveMode] = useState<AppMode>("EXPLORE");

  // Wormhole Warp State
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [warpTargetYear, setWarpTargetYear] = useState<number>(2026);

  // Modals & Drawers
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [isOrionOpen, setIsOrionOpen] = useState<boolean>(false);
  const [orionInitialQuery, setOrionInitialQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [stabilityPercent, setStabilityPercent] = useState<number>(99.4);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [introInitialPhase, setIntroInitialPhase] = useState<number>(0);

  // Recall Matrix State
  const [isRecallOpen, setIsRecallOpen] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<TemporalSnapshot[]>(() => {
    try {
      const stored = localStorage.getItem("tempus_snapshots");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [missions, setMissions] = useState<TemporalMission[]>(() => {
    try {
      const stored = localStorage.getItem("tempus_missions");
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_MISSIONS;
  });

  React.useEffect(() => {
    localStorage.setItem("tempus_snapshots", JSON.stringify(snapshots));
  }, [snapshots]);

  React.useEffect(() => {
    localStorage.setItem("tempus_missions", JSON.stringify(missions));
  }, [missions]);

  // Active Era Data
  const currentEra: HistoricalEra = getEraByYear(currentYear);

  // Handler: Enter from Cinematic Intro
  const handleEnterTimeline = (targetYear: number = 2026) => {
    setCurrentYear(targetYear);
    setHasEnteredTimeline(true);
    audio.startAmbient();
  };

  // Handler: Return to Launch Gateway / Home Screen
  const handleGoHome = () => {
    setIntroInitialPhase(5);
    setHasEnteredTimeline(false);
    setIsOrionOpen(false);
    setSelectedEvent(null);
    setIsSearchOpen(false);
    setIsRecallOpen(false);
  };

  // Handler: Warp to specific year with Wormhole sequence
  const handleInitiateTravel = (targetYear: number) => {
    if (targetYear === currentYear && !isWarping) {
      // If same year, just brief holo chime
      audio.playHoloBeep();
      return;
    }
    setWarpTargetYear(targetYear);
    setIsWarping(true);
  };

  // Handler: Warp completed
  const handleWarpComplete = () => {
    setCurrentYear(warpTargetYear);
    setIsWarping(false);

    // 1. Log a Temporal Snapshot
    const targetEra = getEraByYear(warpTargetYear);
    const newSnapshot: TemporalSnapshot = {
      id: `snap-${Date.now()}`,
      year: warpTargetYear,
      locationName: targetEra.primaryLocation,
      eraName: targetEra.eraName,
      notes: `Chronological warp completed successfully. Stabilized in ${targetEra.eraName}.`,
      timestamp: Date.now(),
    };
    setSnapshots((prev) => [newSnapshot, ...prev]);

    // 2. Scan and complete matching missions
    setMissions((prevMissions) =>
      prevMissions.map((mission) => {
        if (!mission.isCompleted && mission.targetYear === warpTargetYear) {
          // Play a special reward cue or holo notification sound
          audio.playHoloBeep();
          return { ...mission, isCompleted: true };
        }
        return mission;
      })
    );

    // If year > 2030 and in EXPLORE, suggest switching to Future mode
    if (warpTargetYear > 2030 && activeMode === "EXPLORE") {
      setActiveMode("FUTURE");
    }
  };

  // Handler: Ask Orion about specific topic
  const handleAskOrion = (query: string) => {
    setOrionInitialQuery(query);
    setIsOrionOpen(true);
    audio.playHoloBeep();
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const nextState = audio.toggleMute();
    setIsSoundMuted(!nextState);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden select-none">
      {/* Background Three.js 3D Wormhole Tunnel & Relativistic Particles */}
      <WormholeScene
        isWarping={isWarping}
        atmosphereColor={currentEra.atmosphereColor || "#06b6d4"}
        year={currentYear}
      />

      {/* Cinematic Intro Engine (Phase 0 - 5) */}
      {!hasEnteredTimeline && (
        <IntroCinematic
          onEnter={handleEnterTimeline}
          initialPhase={introInitialPhase}
        />
      )}

      {/* Main Experience Cockpit */}
      {hasEnteredTimeline && (
        <div className="relative z-10 flex flex-col min-h-screen justify-between">
          {/* Top Persistent HUD */}
          <HUD
            currentYear={currentYear}
            originYear={2026}
            activeMode={activeMode}
            onModeChange={(mode) => {
              setActiveMode(mode);
            }}
            onGoHome={handleGoHome}
            onOpenSearch={() => setIsSearchOpen(true)}
            onToggleOrion={() => setIsOrionOpen(!isOrionOpen)}
            isOrionOpen={isOrionOpen}
            onToggleRecall={() => setIsRecallOpen(!isRecallOpen)}
            isRecallOpen={isRecallOpen}
            onInitiateTravel={() => handleInitiateTravel(currentYear)}
            stabilityPercent={stabilityPercent}
            locationLabel={currentEra.primaryLocation}
            isSoundMuted={isSoundMuted}
            onToggleSound={handleToggleSound}
          />

          {/* Center Main View Canvas */}
          <main className="flex-1 w-full pb-8">
            {activeMode === "EXPLORE" && (
              <EraMuseumView
                era={currentEra}
                onSelectEvent={(ev) => setSelectedEvent(ev)}
                onAskOrionAboutTopic={handleAskOrion}
              />
            )}

            {activeMode === "JOURNEY" && (
              <JourneyMode onWarpToYear={(yr) => handleInitiateTravel(yr)} />
            )}

            {activeMode === "FUTURE" && (
              <FutureMode
                initialYear={currentYear >= 2030 ? currentYear : 2100}
                onWarpToYear={(yr) => handleInitiateTravel(yr)}
              />
            )}

            {activeMode === "WHAT_IF" && (
              <WhatIfMode onWarpToYear={(yr) => handleInitiateTravel(yr)} />
            )}

            {activeMode === "PARADOX" && (
              <ParadoxSimulator
                currentStability={stabilityPercent}
                onStabilityChange={(newStab) => setStabilityPercent(newStab)}
              />
            )}

            {activeMode === "TIME_MAP" && (
              <TimeMapView onWarpToYear={(yr) => handleInitiateTravel(yr)} />
            )}

            {activeMode === "CAPSULE" && (
              <TimeCapsuleMode
                currentYear={currentYear}
                onWarpToYear={(yr) => handleInitiateTravel(yr)}
              />
            )}

            {activeMode === "INSIDE_EARTH" && (
              <InsideEarthExploration
                currentYear={currentYear}
                onWarpToYear={(yr) => handleInitiateTravel(yr)}
                onGoHome={handleGoHome}
              />
            )}
          </main>

          {/* Bottom Interactive Curved Timeline Scrubber */}
          {activeMode !== "INSIDE_EARTH" && (
            <TimelineNav
              currentYear={currentYear}
              onSelectYear={(yr) => handleInitiateTravel(yr)}
              onInitiateTravel={(yr) => handleInitiateTravel(yr)}
            />
          )}
        </div>
      )}

      {/* Wormhole Hyperspace Warp Transition Overlay */}
      {isWarping && (
        <WormholeTransition
          fromYear={currentYear}
          toYear={warpTargetYear}
          onComplete={handleWarpComplete}
        />
      )}

      {/* Fullscreen Cinematic Event View Modal */}
      {selectedEvent && (
        <CinematicEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onJumpToYear={(yr) => {
            setSelectedEvent(null);
            handleInitiateTravel(yr);
          }}
          onAskOrion={(q) => {
            setSelectedEvent(null);
            handleAskOrion(q);
          }}
        />
      )}

      {/* ORION AI Temporal Intelligence Drawer */}
      <OrionAssistant
        isOpen={isOrionOpen}
        onClose={() => setIsOrionOpen(false)}
        currentYear={currentYear}
        activeMode={activeMode}
        onJumpToYear={(yr) => {
          setIsOrionOpen(false);
          handleInitiateTravel(yr);
        }}
        initialQuery={orionInitialQuery}
      />

      {/* Universal Command & Temporal Search Palette (Ctrl+K) */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectYear={(yr) => handleInitiateTravel(yr)}
      />

      {/* Temporal Recall Drawer (Logs & Missions) */}
      <TemporalRecallDrawer
        isOpen={isRecallOpen}
        onClose={() => setIsRecallOpen(false)}
        snapshots={snapshots}
        missions={missions}
        onWarpToYear={(yr) => handleInitiateTravel(yr)}
        onClearSnapshots={() => setSnapshots([])}
      />
    </div>
  );
}

export default App;
