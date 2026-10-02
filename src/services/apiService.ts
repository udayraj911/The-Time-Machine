import { OrionChatMessage, FutureScenario, AlternateTimelineScenario } from "../types";

export async function askTempus(
  message: string,
  currentYear: number,
  mode: string,
  history: OrionChatMessage[]
): Promise<{
  reply: string;
  suggestedJumpYear?: number;
  location?: string;
  eraTitle?: string;
}> {
  try {
    const res = await fetch("/api/gemini/tempus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        currentYear,
        mode,
        history: history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("Using offline TEMPUS fallback mode:", error);
    return {
      reply: `[TEMPUS TEMPORAL ARCHIVE — YEAR ${currentYear}]\n\nTemporal query received: "${message}". In temporal sector ${currentYear}, our records register monumental developments across civilization, technology, and culture. You can initiate a jump or inspect historical nodes directly on your HUD.`,
      suggestedJumpYear: currentYear,
    };
  }
}

export async function generateAlternateTimeline(
  premise: string,
  divergenceYear?: number
): Promise<{ alternateScenario: AlternateTimelineScenario }> {
  try {
    const res = await fetch("/api/gemini/what-if", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ premise, divergenceYear }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("Using fallback alternate timeline:", error);
    return {
      alternateScenario: {
        title: `Alternate Timeline: ${premise}`,
        divergencePoint: `Year ${divergenceYear || 1950} — Divergence event initiated.`,
        firstOrderImpact: "Immediate realignment of technological funding and geopolitical strategies across major powers.",
        secondOrderImpact: "Rapid societal transformation occurred 30 years ahead of standard timeline parameters.",
        modernConsequences: "Modern global infrastructure operates on altered protocols with transformed cultural landscape.",
        timelineComparison: [
          { year: divergenceYear || 1950, primeEvent: "Standard historical progression", alternateEvent: premise },
          { year: (divergenceYear || 1950) + 15, primeEvent: "Cold War aerospace race", alternateEvent: "Early global coordination protocols established" },
          { year: (divergenceYear || 1950) + 35, primeEvent: "Microcomputer revolution", alternateEvent: "Early interplanetary probes and autonomous energy grids" },
          { year: 2026, primeEvent: "Contemporary Digital Era", alternateEvent: "Solar System Civilization Status" }
        ],
        quantumDivergenceScore: 84,
        butterflyIndex: "High (Level 4 Temporal Ripple)",
        unintendedConsequence: "Unexpected acceleration of adjacent technological domains."
      },
    };
  }
}

export async function simulateFutureEra(
  targetYear: number,
  domain: string = "all"
): Promise<{ futureScenario: FutureScenario }> {
  try {
    const res = await fetch("/api/gemini/future-simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetYear, domain }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("Using fallback future scenario:", error);
    return {
      futureScenario: {
        year: targetYear,
        eraTitle: `Synthetic Renaissance & Planetary Stewardship (${targetYear})`,
        disclaimer: "AI-GENERATED FUTURE SCENARIO (SPECULATIVE SIMULATION)",
        overview: `By the dawn of ${targetYear}, civilization has transitioned to multi-planetary synthesis, closed-loop bio-computation, and orbital energy networks.`,
        domains: {
          technology: "Room-temperature quantum lattice computing and localized matter reconfigurers.",
          transportation: "Sub-orbital vacuum transit tunnels and solar-sail orbital commuter rings.",
          cities: "Vertical carbon-negative arcologies integrated with bioluminescent atmospheric purification.",
          energy: "Zero-point magnetic confinement fusion and orbital microwave solar relay swarms.",
          space: "Self-sustaining settlements across Lunar lava tubes and Martian Olympus Base.",
          ai: "Symbiotic distributed neural mesh working alongside biological minds as cognitive partners."
        },
        speculativePlausibility: 78,
        keyMilestones: [
          { year: targetYear - 40, event: "Commercial deployment of fusion micro-reactors" },
          { year: targetYear - 20, event: "First child born on off-world permanent colony" },
          { year: targetYear, event: "Global net-negative atmospheric carbon balance achieved" }
        ],
        dailyLifeSnapshot: `Citizens wake to personalized atmospheric optimization within biophilic arcologies, utilizing light-based cognitive links to coordinate global environmental regeneration.`,
        greatestChallenge: `Preserving biological heritage while expanding through synthetic cognitive dimensions.`
      }
    };
  }
}

export async function fetchHistoricalDeepDive(
  topic: string,
  year: number,
  context: string
): Promise<{
  title: string;
  year: number;
  narrative: string;
  unseenDetails: string[];
  globalEcho: string;
  quote?: string;
  quoteAuthor?: string;
}> {
  try {
    const res = await fetch("/api/gemini/deep-dive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, year, context }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("Using fallback deep dive:", error);
    return {
      title: topic,
      year,
      narrative: `In ${year}, ${topic} stood as a transformative milestone in human history. Context: ${context}. Archival temporal analysis reveals profound lasting ripples across global philosophy, engineering, and human culture.`,
      unseenDetails: [
        "Primary source documents in temporal archives reveal clandestine preparations leading up to this moment.",
        "Uncredited mathematicians and logistics planners whose calculations were essential for this milestone.",
        "A sudden atmospheric or meteorological condition nearly altered the scheduled outcome."
      ],
      globalEcho: "This event continues to directly influence contemporary technological, political, and philosophical paradigms.",
      quote: "The future belongs to those who prepare for it today.",
      quoteAuthor: "Temporal Archive Record"
    };
  }
}
