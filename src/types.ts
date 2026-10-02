export type AppMode = 
  | "EXPLORE"
  | "JOURNEY"
  | "TIME_MAP"
  | "FUTURE"
  | "WHAT_IF"
  | "PARADOX"
  | "CAPSULE"
  | "INSIDE_EARTH";

export type TravelState = "IDLE" | "CALCULATING" | "WARPING" | "ARRIVED";

export interface TemporalSnapshot {
  id: string;
  year: number;
  locationName: string;
  eraName: string;
  notes: string;
  timestamp: number;
}

export interface TemporalMission {
  id: string;
  title: string;
  targetYear: number;
  targetLocation: string;
  objective: string;
  isCompleted: boolean;
  badgeName: string;
}

export interface HistoricalEvent {
  id: string;
  year: number;
  dateStr?: string;
  title: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  category: "science" | "politics" | "culture" | "space" | "technology" | "conflict";
  summary: string;
  detailedNarrative: string;
  keyFigures: string[];
  impactScore: number; // 1-100
  imageUrl?: string;
  unseenFacts?: string[];
  quote?: { text: string; author: string };
  tags: string[];
}

export interface TechArtifact {
  id: string;
  name: string;
  year: number;
  inventor?: string;
  category: string;
  description: string;
  significance: string;
}

export interface HistoricalFigure {
  id: string;
  name: string;
  yearsAlive: string;
  role: string;
  location: string;
  bio: string;
  keyContribution: string;
}

export interface HistoricalEra {
  id?: string;
  year: number;
  eraName: string;
  epochTag: "COSMIC" | "PREHISTORIC" | "ANCIENT" | "CLASSICAL" | "MEDIEVAL" | "RENAISSANCE" | "INDUSTRIAL" | "ATOMIC" | "DIGITAL" | "SPECULATIVE_FUTURE";
  tagline: string;
  description: string;
  populationEstimate?: string;
  globalClimate?: string;
  dominantPower?: string;
  primaryLocation: string;
  coordinates: [number, number];
  events: HistoricalEvent[];
  technologies: TechArtifact[];
  figures: HistoricalFigure[];
  cultureHighlights: string[];
  soundscapeMood: string;
  atmosphereColor: string; // Hex or CSS color
}

export interface JourneyStep {
  year: number;
  title: string;
  location: string;
  description: string;
  milestone: string;
  impact: string;
}

export interface JourneyTheme {
  id: string;
  title: string;
  iconName: string;
  description: string;
  timeSpan: string;
  steps: JourneyStep[];
}

export interface FutureDomain {
  technology: string;
  transportation: string;
  cities: string;
  energy: string;
  space: string;
  ai: string;
}

export interface FutureScenario {
  year: number;
  eraTitle: string;
  disclaimer: string;
  overview: string;
  domains: FutureDomain;
  speculativePlausibility: number;
  keyMilestones: { year: number; event: string }[];
  dailyLifeSnapshot?: string;
  greatestChallenge?: string;
}

export interface AlternateTimelinePoint {
  year: number;
  primeEvent: string;
  alternateEvent: string;
}

export interface AlternateTimelineScenario {
  title: string;
  divergencePoint: string;
  divergenceYear?: number;
  firstOrderImpact: string;
  secondOrderImpact: string;
  modernConsequences: string;
  timelineComparison: AlternateTimelinePoint[];
  quantumDivergenceScore: number;
  butterflyIndex: string;
  keyFiguresAffected?: string[];
  unintendedConsequence?: string;
}

export interface ParadoxChoice {
  id: string;
  text: string;
  butterflyConsequence: string;
  stabilityImpact: number; // e.g. -25%
  divergenceNote: string;
}

export interface ParadoxScenario {
  id: string;
  year: number;
  title: string;
  nexusEvent: string;
  historicalOutcome: string;
  dilemma: string;
  choices: ParadoxChoice[];
}

export interface TimeCapsule {
  id: string;
  creatorName: string;
  creationYear: number;
  targetUnlockYear: number;
  message: string;
  favoriteEras?: number[];
  predictionForFuture?: string;
  sealedAt: number;
  isSealed: boolean;
}

export interface OrionChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  suggestedJumpYear?: number;
  location?: string;
  eraTitle?: string;
}
