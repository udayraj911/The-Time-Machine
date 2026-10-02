import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      system: "CHRONOS Temporal Engine",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // TEMPUS AI Temporal Guide Chat endpoint
  app.post("/api/gemini/tempus", async (req, res) => {
    try {
      const { message, currentYear, mode = "HISTORICAL", history = [] } = req.body;
      const ai = getGenAI();
 
      if (!ai) {
        // Fallback simulated response
        return res.json({
          reply: `[TEMPUS TEMPORAL ARCHIVE - YEAR ${currentYear || 2026}]\n\nTemporal query received: "${message}". In temporal sector ${currentYear}, our records register monumental shifts in civilization, engineering, and culture. Initiate wormhole jump or select an event node on your HUD to dive deeper into this epoch.`,
          suggestedJumpYear: currentYear || 2026,
        });
      }
 
      const systemInstruction = `You are TEMPUS (Temporal Exploration, Mapping, & Processing Universal System), the sophisticated, cinematic AI guide of CHRONOS, the experimental temporal exploration system.
The user is currently positioned at Year ${currentYear || 2026} in ${mode} mode.
Your voice is highly intelligent, immersive, awe-inspiring, yet concise and accurate.
Respond directly to their temporal question with vivid historical clarity or speculative future depth.
Keep answers between 2-4 structured, punchy paragraphs.
If the user asks to go to or asks about a specific year (e.g. "Take me to 1969" or "What happened in India in 1947?"), include a JSON block at the very end formatted strictly as:
\`\`\`json
{"suggestedJumpYear": 1947, "location": "India", "eraTitle": "Indian Independence & Partition"}
\`\`\`
Make the user feel like they are standing inside a high-tech observation dome peering into history or simulated futures.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          ...history.map((h: { role: string; content: string }) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          })),
          { role: "user", parts: [{ text: message }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Temporal transmission completed without payload.";
      
      // Extract jump metadata if present
      let suggestedJumpYear: number | null = null;
      let location: string | null = null;
      let eraTitle: string | null = null;
      
      const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/);
      let cleanReply = replyText;
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          suggestedJumpYear = parsed.suggestedJumpYear || null;
          location = parsed.location || null;
          eraTitle = parsed.eraTitle || null;
          cleanReply = replyText.replace(jsonMatch[0], "").trim();
        } catch {
          // ignore parse error
        }
      }

      res.json({
        reply: cleanReply,
        suggestedJumpYear,
        location,
        eraTitle,
      });
    } catch (error: any) {
      console.warn("Error in /api/gemini/tempus, running fallback simulation:", error);
      res.json({
        reply: `[TEMPUS RECOVERY ASSIST — LOCALIZED TIMELINE FLUX METADATA ACTIVE]\n\nI am experiencing high temporal transmission demand right now. However, my pre-calculated database for Year ${req.body.currentYear || 2026} is fully online. Let me know what specific query or historical milestones in the ${req.body.currentYear || 2026} quadrant you would like to map next!`,
        suggestedJumpYear: req.body.currentYear || null,
        location: null,
        eraTitle: null,
      });
    }
  });

  // WHAT IF? Mode Alternate History Generator
  app.post("/api/gemini/what-if", async (req, res) => {
    try {
      const { premise, divergenceYear } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          alternateScenario: {
            title: `Alternate Timeline: ${premise}`,
            divergencePoint: `Year ${divergenceYear || 1950} — Divergence event initiated.`,
            firstOrderImpact: "Immediate realignment of technological funding and geopolitical strategies across major powers.",
            secondOrderImpact: "Rapid societal transformation occurred 30 years ahead of standard timeline parameters.",
            modernConsequences: "Modern global infrastructure operates on decentralized quantum protocols with altered cultural landscape.",
            timelineComparison: [
              { year: divergenceYear || 1950, primeEvent: "Standard historical progression", alternateEvent: premise },
              { year: (divergenceYear || 1950) + 15, primeEvent: "Cold War aerospace race", alternateEvent: "Global information exchange network established early" },
              { year: (divergenceYear || 1950) + 35, primeEvent: "Microcomputer revolution", alternateEvent: "Early interplanetary probes and autonomous energy grids" },
              { year: 2026, primeEvent: "Contemporary Digital Era", alternateEvent: "Solar System Civilization Status" }
            ],
            quantumDivergenceScore: 84,
            butterflyIndex: "High (Level 4 Temporal Ripple)"
          }
        });
      }

      const prompt = `You are the CHRONOS Alternate Timeline Computation Engine.
Compute an alternate history simulation based on the following divergence premise:
Premise: "${premise}"
Point of Divergence (POD) Year: ${divergenceYear || "Historical Nexus"}

Generate a detailed, scientifically plausible, and captivating alternate timeline response in JSON format.
Clearly mark this as a fictional alternate timeline simulation.

Format the JSON response with this exact schema:
{
  "title": "Short punchy name for this timeline",
  "divergencePoint": "Description of the exact moment and mechanism of historical split",
  "firstOrderImpact": "Immediate 5-10 year consequences",
  "secondOrderImpact": "Macro geopolitical, cultural, and technological shifts across 20-50 years",
  "modernConsequences": "What the world looks like in 2026/Present Day in this timeline",
  "timelineComparison": [
    {"year": number, "primeEvent": "What actually happened in our timeline", "alternateEvent": "What happened in this alternate branch"}
  ],
  "quantumDivergenceScore": number between 10 and 100,
  "butterflyIndex": "Low / Moderate / High / Catastrophic Level Ripple",
  "keyFiguresAffected": ["Name 1 (Impact)", "Name 2 (Impact)"],
  "unintendedConsequence": "Surprising twist or unexpected consequence of this change"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.8,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ alternateScenario: parsed });
    } catch (error: any) {
      console.warn("Error in /api/gemini/what-if, running fallback timeline generation:", error);
      const premise = req.body.premise || "Alternative Premise";
      const divergenceYear = req.body.divergenceYear || 1950;
      res.json({
        alternateScenario: {
          title: `Timeline Simulation: ${premise}`,
          divergencePoint: `Year ${divergenceYear} — Divergence event initiated.`,
          firstOrderImpact: "Immediate realignment of technological funding and geopolitical strategies across major powers.",
          secondOrderImpact: "Rapid societal transformation occurred 30 years ahead of standard timeline parameters.",
          modernConsequences: "Modern global infrastructure operates on decentralized quantum protocols with an altered cultural landscape.",
          timelineComparison: [
            { year: divergenceYear, primeEvent: "Standard historical progression", alternateEvent: premise },
            { year: divergenceYear + 15, primeEvent: "Cold War aerospace race", alternateEvent: "Global information exchange network established early" },
            { year: divergenceYear + 35, primeEvent: "Microcomputer revolution", alternateEvent: "Early interplanetary probes and autonomous energy grids" },
            { year: 2026, primeEvent: "Contemporary Digital Era", alternateEvent: "Solar System Civilization Status" }
          ],
          quantumDivergenceScore: 84,
          butterflyIndex: "High (Level 4 Temporal Ripple)",
          keyFiguresAffected: ["Historical leaders", "Key inventors"],
          unintendedConsequence: "Surprising acceleration of scientific and philosophical synergy across continents."
        }
      });
    }
  });

  // FUTURE MODE Speculative Scenario Generator
  app.post("/api/gemini/future-simulate", async (req, res) => {
    try {
      const { targetYear, domain = "all" } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          futureScenario: {
            year: targetYear || 2100,
            eraTitle: `Synthetic Renaissance & Planetary Stewardship (${targetYear || 2100})`,
            disclaimer: "AI-GENERATED FUTURE SCENARIO (SPECULATIVE SIMULATION)",
            overview: `By the dawn of ${targetYear || 2100}, humanity has transitioned from Earth-bound carbon dependence to multi-planetary synthesis and closed-loop bio-computational ecosystems.`,
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
              { year: (targetYear || 2100) - 40, event: "Commercial deployment of fusion micro-reactors" },
              { year: (targetYear || 2100) - 20, event: "First child born on off-world permanent colony" },
              { year: targetYear || 2100, event: "Global net-negative atmospheric carbon balance achieved" }
            ]
          }
        });
      }

      const prompt = `You are the CHRONOS Future Projection Engine.
Generate a grounded, fascinating, speculative future scenario for Year ${targetYear} focusing on ${domain}.
Remember: Clearly denote this is an AI-GENERATED FUTURE SCENARIO (SPECULATIVE SIMULATION based on current scientific trajectories).

Return JSON with this schema:
{
  "year": ${targetYear},
  "eraTitle": "Evocative Title for this Future Era",
  "disclaimer": "AI-GENERATED FUTURE SCENARIO (SPECULATIVE SIMULATION)",
  "overview": "2-3 sentence evocative overview of civilization in this era",
  "domains": {
    "technology": "Breakthrough technologies in use",
    "transportation": "How humans and goods move across land, sky, and space",
    "cities": "Urban architecture, ecology, and daily living environments",
    "energy": "Power generation and planetary resource management",
    "space": "Human presence in the solar system or deep cosmos",
    "ai": "Status of artificial intelligence, synthetic biology, and consciousness"
  },
  "speculativePlausibility": number between 40 and 95,
  "keyMilestones": [
    {"year": number, "event": "Milestone leading to this era"}
  ],
  "dailyLifeSnapshot": "A vivid 1-paragraph narrative description of a typical morning for a citizen in this year",
  "greatestChallenge": "The central philosophical or existential challenge humanity faces in this era"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.75,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ futureScenario: parsed });
    } catch (error: any) {
      console.warn("Error in /api/gemini/future-simulate, running backup future scenario:", error);
      const targetYear = req.body.targetYear || 2100;
      res.json({
        futureScenario: {
          year: targetYear,
          eraTitle: `Synthetic Renaissance & Stewardship (${targetYear})`,
          disclaimer: "AI-GENERATED FUTURE SCENARIO (SPECULATIVE SIMULATION RECOVERY)",
          overview: `At Year ${targetYear}, Earth operates on closed-loop smart systems and high-density renewable energy structures.`,
          domains: {
            technology: "Quantum cluster networks and bio-compatible materials.",
            transportation: "Maglev vacuum corridors and orbital cargo arrays.",
            cities: "Vertical carbon-negative structures with integrated biological cooling panels.",
            energy: "Advanced geothermal extraction and micro-fusion reactors.",
            space: "Permanent scientific monitoring camps on Lunar and Martian sites.",
            ai: "Distributed coordination systems optimizing climate balance and transport routes."
          },
          speculativePlausibility: 82,
          keyMilestones: [
            { year: targetYear - 50, event: "Development of carbon-negative polymers" },
            { year: targetYear, event: "Global net-zero emissions achieved via bio-filtration networks" }
          ],
          dailyLifeSnapshot: "Citizens interact via neural carbon interfaces, working in close tandem with automated atmospheric sensors.",
          greatestChallenge: "Philosophical integration of digital consciousness with carbon biology."
        }
      });
    }
  });

  // Deep Dive into Historical Artifact / Figure
  app.post("/api/gemini/deep-dive", async (req, res) => {
    try {
      const { topic, year, context } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          title: topic,
          year,
          narrative: `In ${year}, ${topic} stood as a transformative milestone in human history. Context: ${context}. Archival analysis indicates profound lasting ripples throughout global politics, philosophy, and human ingenuity.`,
          unseenDetails: ["Key primary source documents uncovered in temporal archives", "Lesser-known contributors whose work made this milestone possible"],
          globalEcho: "This event continues to influence modern democratic and technological frameworks."
        });
      }

      const prompt = `Provide an immersive, deep-dive archival dossier on "${topic}" during the Year ${year}.
Context provided: ${context || "Historical archive inspection"}

Return JSON formatted as:
{
  "title": "${topic}",
  "year": ${year},
  "narrative": "A vivid, 2-3 paragraph museum-quality historical narrative written from the perspective of an advanced future temporal historian inspecting the event",
  "unseenDetails": ["3 fascinating, lesser-known historical nuances or secret facts about this moment"],
  "globalEcho": "How this specific moment altered the long-term trajectory of human civilization",
  "quote": "A famous or authentic quote from that moment or historical figure",
  "quoteAuthor": "Author of the quote"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.warn("Error in /api/gemini/deep-dive, running offline history deep-dive dossier:", error);
      const topic = req.body.topic || "Historical Topic";
      const year = req.body.year || 2026;
      res.json({
        title: topic,
        year: year,
        narrative: `Archival dossiers register "${topic}" as a cornerstone event of Year ${year}. Despite regional complexities, it established new precedents in engineering, philosophy, and political organization that echoed throughout subsequent generations.`,
        unseenDetails: [
          "Primary records hidden in regional libraries highlight secondary collaborations.",
          "Technological tools developed during this milestone were later adapted for agricultural planning.",
          "Original blueprints reveal unrecognized aesthetic alignments with natural geography."
        ],
        globalEcho: "This event served as a guiding catalyst for subsequent institutional and technological reform.",
        quote: "History is a cycle of exploration, mapping, and realignment.",
        quoteAuthor: "TEMPUS Chronicler"
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CHRONOS] Temporal Core Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
