import { ParadoxScenario } from "../types";

export const PARADOX_SCENARIOS: ParadoxScenario[] = [
  {
    id: "titanic-1912",
    year: 1912,
    title: "The Iceberg at 41°43'N, 49°56'W",
    nexusEvent: "RMS Titanic collides with an iceberg in the North Atlantic on April 14, 1912.",
    historicalOutcome: "Over 1,500 lives lost; catalyzed international SOLAS maritime safety treaties, continuous radio watch mandates, and the International Ice Patrol.",
    dilemma: "You possess the temporal coordinates to remotely sound the fog horn 10 minutes prior, altering the ship's course safely south.",
    choices: [
      {
        id: "save-ship",
        text: "Sound Emergency Siren & Divert Titanic Away From Iceberg",
        butterflyConsequence: "The Titanic docks safely in New York. However, maritime safety laws remain lax for 30 more years, leading to a far greater peacetime catastrophe with 4,000 casualties during the 1928 Atlantic storms without required lifeboats or 24/7 radio distress monitoring.",
        stabilityImpact: -24,
        divergenceNote: "Level 3 Paradox: Safety legislation delayed by 3 decades; passenger manifests shift key World War I intelligence officers."
      },
      {
        id: "maintain-timeline",
        text: "Preserve Timeline & Observe Historical Trajectory",
        butterflyConsequence: "Standard timeline preserved. International safety conventions enacted, radio distress standards become globally mandatory, safeguarding millions of subsequent maritime passengers across the 20th century.",
        stabilityImpact: 0,
        divergenceNote: "Timeline coherence remains locked at 100%. No temporal ripples detected."
      },
      {
        id: "warn-radio-officer",
        text: "Transmit Encrypted Warning to Marconi Wireless Operator Jack Phillips",
        butterflyConsequence: "Operator dismisses the phantom unencrypted signal as atmospheric static, but reduces speed slightly. The collision is glancing; ship limps to Halifax. Shipbuilding standards freeze in 1912 patterns.",
        stabilityImpact: -12,
        divergenceNote: "Level 2 Paradox: Minor divergence in North Atlantic naval architectural evolution."
      }
    ]
  },
  {
    id: "penicillin-1928",
    year: 1928,
    title: "The Unwashed Petri Dish of St. Mary's",
    nexusEvent: "Alexander Fleming leaves a staphylococci culture plate uncovered on his bench before leaving for holiday.",
    historicalOutcome: "Penicillium notatum mold drifts in, producing penicillin and saving an estimated 200 million lives from bacterial infections.",
    dilemma: "A lab assistant is about to sterilize and wash the contaminated dish before Fleming returns to inspect it.",
    choices: [
      {
        id: "clean-dish",
        text: "Sterilize The Dirty Petri Dish (Enforce Cleanliness Protocol)",
        butterflyConsequence: "Penicillin is not discovered until 1958. Bacterial infections remain the #1 cause of mortality throughout World War II. Global human life expectancy drops by 14 years across the mid-20th century.",
        stabilityImpact: -58,
        divergenceNote: "CRITICAL PARADOX ALERT: Massive demographic contraction across 1930–1960. 120 million future descendants vanish from existence."
      },
      {
        id: "preserve-mold",
        text: "Ensure The Window Stays Open & Mold Colony Thrives",
        butterflyConsequence: "Fleming discovers the halo of inhibited bacterial growth. Antibiotic era launches on schedule, transforming global medicine.",
        stabilityImpact: 0,
        divergenceNote: "Prime Timeline intact. Medical trajectory stable."
      }
    ]
  },
  {
    id: "apollo-1202-alarm",
    year: 1969,
    title: "The 1202 Program Alarm at 3,000 Feet",
    nexusEvent: "During Apollo 11's powered descent, the Lunar Guidance Computer flashes 1202 and 1201 radar buffer overload alarms.",
    historicalOutcome: "26-year-old guidance officer Steve Bales, backed by Margaret Hamilton's asynchronous software design, calls 'GO' to proceed with the landing.",
    dilemma: "The radar data overload surges. You can initiate an automated emergency abort separation sequence.",
    choices: [
      {
        id: "abort-landing",
        text: "Trigger Abort Stage Separation & Return Eagle to Command Module",
        butterflyConsequence: "Apollo 11 aborts safely without injury, but misses the landing. The Soviet Union's N1-L3 program redoubles efforts, landing cosmonauts in 1971. The Space Race extends 25 more years into nuclear orbital militarization.",
        stabilityImpact: -38,
        divergenceNote: "Major Geopolitical Shift: Space Race continues until 1995; permanent lunar military outposts established by both superpowers."
      },
      {
        id: "trust-software",
        text: "Rely on Margaret Hamilton's Priority Scheduling (Call GO)",
        butterflyConsequence: "Computer drops low-priority radar tasks to maintain engine throttle. Neil Armstrong takes manual control and touches down in the Sea of Tranquility with 25 seconds of fuel remaining.",
        stabilityImpact: 0,
        divergenceNote: "Prime timeline preserved. Iconic 'One Small Step' recorded in human history."
      }
    ]
  },
  {
    id: "alexandria-fire",
    year: -48,
    title: "The Burning of the Library of Alexandria",
    nexusEvent: "During Julius Caesar's siege of Alexandria, fire spreads from the harbor fleet to warehouses and library scroll depots.",
    historicalOutcome: "Irreplaceable classical manuscripts on mathematics, astronomy, heliocentrism, and drama are permanently lost.",
    dilemma: "Deploy an atmospheric suppression barrier to redirect the sea breeze away from the royal library quarter.",
    choices: [
      {
        id: "save-library",
        text: "Deploy Fire Suppression Barrier & Protect Ancient Scrolls",
        butterflyConsequence: "Over 500,000 scrolls survive, including Aristarchus's full heliocentric proofs and Hero of Alexandria's advanced steam engine schematics. The Industrial Revolution begins in Southern Europe around 850 CE instead of 1780 CE. Humanity reaches the Moon in 1150 CE.",
        stabilityImpact: -72,
        divergenceNote: "Hyper-Acceleration Paradox: Human technological development accelerated by 800 years. Contemporary year 2026 resembles Year 2800 in standard scale."
      },
      {
        id: "let-burn",
        text: "Maintain Historical Nexus Integrity",
        butterflyConsequence: "Library collections disperse and diminish; knowledge is slowly rediscovered through Islamic Golden Age scholars and European Renaissance humanists.",
        stabilityImpact: 0,
        divergenceNote: "Timeline Coherence at 100%. History unfolds along canonical milestones."
      }
    ]
  }
];
