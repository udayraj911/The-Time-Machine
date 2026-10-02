import { JourneyTheme } from "../types";

export const HISTORICAL_JOURNEYS: JourneyTheme[] = [
  {
    id: "computers",
    title: "Evolution of Computers",
    iconName: "Cpu",
    description: "From mechanical difference engines and vacuum tubes to silicon microprocessors and quantum neural supercomputers.",
    timeSpan: "1837 — 2026+",
    steps: [
      {
        year: 1837,
        title: "Babbage's Analytical Engine & Ada Lovelace",
        location: "London, England",
        milestone: "First conceptual general-purpose mechanical programmable computer.",
        impact: "Ada Lovelace writes the first computer algorithm to calculate Bernoulli numbers.",
        description: "Charles Babbage designs a steam-powered mechanical calculator featuring a memory store and mill CPU, controlled via punched cards."
      },
      {
        year: 1945,
        title: "ENIAC & The Von Neumann Architecture",
        location: "Philadelphia, USA",
        milestone: "First electronic general-purpose digital computing machine.",
        impact: "Established the stored-program architecture of CPU, memory, and I/O still used today.",
        description: "Weighing 30 tons with 18,000 vacuum tubes, ENIAC executed 5,000 addition cycles per second to compute ballistic artillery tables."
      },
      {
        year: 1971,
        title: "Intel 4004: The First Microprocessor",
        location: "Santa Clara, California",
        milestone: "Complete 4-bit CPU etched onto a single silicon chip.",
        impact: "Miniaturized room-sized computing power into the palm of a human hand.",
        description: "Federico Faggin and Ted Hoff integrate 2,300 transistors on a single die, sparking the personal computer revolution."
      },
      {
        year: 1984,
        title: "Apple Macintosh & Graphical User Interface",
        location: "Cupertino, California",
        milestone: "First mass-market computer with a mouse and graphical windowing system.",
        impact: "Transformed computers from arcane command-line tools into intuitive creative mediums.",
        description: "Introduced desktop metaphors, bitmapped typography, and graphical paint/word software to everyday creators."
      },
      {
        year: 2007,
        title: "The Smartphone Revolution (iPhone)",
        location: "San Francisco, USA",
        milestone: "Capacitive multi-touch pocket supercomputer with ubiquitous connectivity.",
        impact: "Placed high-speed internet, GPS, high-resolution cameras, and global apps into the hands of billions.",
        description: "Combined mobile telephone, touch-screen iPod, and desktop-class Safari browser into a single glass slab."
      },
      {
        year: 2026,
        title: "Multimodal AI & Neural Compute Clusters",
        location: "Global Distributed Mesh",
        milestone: "Exaflop AI reasoning engines synthesizing code, logic, and scientific discoveries.",
        impact: "Computers become autonomous cognitive collaborators capable of programming themselves and generating new science.",
        description: "Advanced foundation models operate across millions of tensor cores, processing real-time audio, vision, and deep mathematical reasoning."
      }
    ]
  },
  {
    id: "space",
    title: "History of Space Exploration",
    iconName: "Rocket",
    description: "Humanity's daring voyage from the Earth's atmosphere to the Moon, Mars, and the edge of the interstellar void.",
    timeSpan: "1957 — 2050+",
    steps: [
      {
        year: 1957,
        title: "Sputnik 1: Dawn of the Space Age",
        location: "Baikonur Cosmodrome, USSR",
        milestone: "First artificial satellite placed into orbit around Earth.",
        impact: "Inaugurated the Space Race and proved objects could achieve orbital velocity.",
        description: "An 83.6 kg polished aluminum sphere broadcast radio beeps across Earth for 21 days, traveling at 29,000 km/h."
      },
      {
        year: 1969,
        title: "Apollo 11: Footprints on the Moon",
        location: "Sea of Tranquility, The Moon",
        milestone: "First human beings walk on another celestial world.",
        impact: "Proved humanity could leave its planetary cradle and return safely.",
        description: "Neil Armstrong and Buzz Aldrin descend in Lunar Module Eagle while Michael Collins orbits aboard Columbia."
      },
      {
        year: 1977,
        title: "Voyager 1 & 2: The Grand Tour",
        location: "Cape Canaveral, Florida",
        milestone: "Twin probes explore Jupiter, Saturn, Uranus, Neptune, and interstellar space.",
        impact: "Carries the Golden Record as an eternal message from Earth to the cosmos.",
        description: "Voyager 1 becomes the farthest human-made object in history, crossing the heliopause into the interstellar medium."
      },
      {
        year: 1990,
        title: "Hubble Space Telescope Deployment",
        location: "Low Earth Orbit (540 km)",
        milestone: "First major optical telescope operating above Earth's atmospheric distortion.",
        impact: "Discovered the accelerated expansion of the universe and imaged deep field galaxies 13 billion light years away.",
        description: "Deployed from Space Shuttle Discovery, Hubble provided breathtaking imagery that redefined our view of cosmic history."
      },
      {
        year: 2026,
        title: "Artemis Program & Commercial Starships",
        location: "Lunar South Pole (Shackleton Crater)",
        milestone: "Permanent human return to the Moon and development of rapid-reusable heavy launch vehicles.",
        impact: "Establishes industrial lunar infrastructure to mine water ice for Mars transit fuel.",
        description: "Artemis astronauts establish camp at the lunar south pole, harvesting ice deposits inside permanently shadowed craters."
      },
      {
        year: 2050,
        title: "Olympus Base Mars Metropolis",
        location: "Olympus Mons, Mars",
        milestone: "First permanent off-world city of 50,000 humans.",
        impact: "Humanity officially becomes a multi-planetary species immune to single-planet extinction events.",
        description: "Pressurized lava tube arcologies produce synthetic food, extract water from permafrost, and initiate bio-terraforming."
      }
    ]
  },
  {
    id: "india",
    title: "History of India",
    iconName: "Compass",
    description: "5,000 years of profound spiritual philosophy, architectural mastery, scientific mathematics, and democratic resilience.",
    timeSpan: "2500 BCE — 2026+",
    steps: [
      {
        year: -2500,
        title: "Indus Valley Civilization (Harappa & Mohenjo-daro)",
        location: "Indus River Basin",
        milestone: "World's most advanced bronze-age urban sanitation and town planning.",
        impact: "Pioneered standardized brick ratios, covered sewer drainage, and international maritime trade with Mesopotamia.",
        description: "Grid-planned cities featuring multi-story baked-brick houses, public baths, granaries, and undeciphered script seals."
      },
      {
        year: -320,
        title: "The Mauryan Empire & Emperor Ashoka",
        location: "Pataliputra (Patna), India",
        milestone: "Unification of the Indian subcontinent under an ethical administrative state.",
        impact: "Ashoka's Edicts carved on stone pillars promoted non-violence (Ahimsa), religious tolerance, and Buddhist diplomacy across Asia.",
        description: "Chandragupta Maurya and Chanakya author the Arthashastra, establishing a vast unified empire spanning from Afghanistan to Bengal."
      },
      {
        year: 1632,
        title: "Mughal Architecture & The Taj Mahal",
        location: "Agra, India",
        milestone: "Pinnacle of Indo-Islamic architectural symmetry and marble inlay craftsmanship.",
        impact: "Globally celebrated UNESCO masterpiece symbolizing enduring love and synthesis of Persian, Indian, and Islamic art.",
        description: "Commissioned by Emperor Shah Jahan in memory of Mumtaz Mahal, constructed with translucent white Makrana marble."
      },
      {
        year: 1947,
        title: "Indian Independence & Constitution",
        location: "New Delhi, India",
        milestone: "Non-violent triumph over British colonial rule and establishment of the world's largest democracy.",
        impact: "Dr. B. R. Ambedkar crafts a progressive secular constitution guaranteeing fundamental rights and universal suffrage.",
        description: "Mahatma Gandhi's Satyagraha inspires civil rights movements across the globe; Jawaharlal Nehru declares India's Tryst with Destiny."
      },
      {
        year: 2023,
        title: "Chandrayaan-3 Lands on the Lunar South Pole",
        location: "ISRO Telemetry / Lunar South Pole",
        milestone: "India becomes the first nation in history to land a spacecraft near the Moon's South Pole.",
        impact: "Demonstrated ultra-cost-effective deep space engineering and validated presence of lunar surface minerals.",
        description: "ISRO's Vikram lander and Pragyan rover touch down near Manzinus C crater, analyzing lunar soil chemistry."
      }
    ]
  },
  {
    id: "transportation",
    title: "Evolution of Transportation",
    iconName: "Navigation",
    description: "From wooden spoked wheels and steam locomotives to supersonic flight and orbital magnetic accelerators.",
    timeSpan: "3500 BCE — 2100+",
    steps: [
      {
        year: -3500,
        title: "Invention of the Spoked Wooden Wheel",
        location: "Mesopotamia & Eurasian Steppes",
        milestone: "Circular wheel and axle reducing friction for heavy cargo transport.",
        impact: "Revolutionized agriculture, trade logistics, and chariot warfare across Afro-Eurasia.",
        description: "Solid wood disks gave way to lightened spoked wheels, transforming human capability to move goods across vast distances."
      },
      {
        year: 1804,
        title: "Trevithick & Stephenson Steam Locomotives",
        location: "Wales & England",
        milestone: "First mechanical locomotion replacing draft animal muscle power.",
        impact: "Connected cities with high-speed iron rails, standardizing time zones and launching modern commerce.",
        description: "George Stephenson's Rocket reached speeds of 47 km/h, proving steam rail was the definitive future of overland transport."
      },
      {
        year: 1903,
        title: "Wright Brothers: First Controlled Powered Flight",
        location: "Kitty Hawk, North Carolina",
        milestone: "Heavier-than-air sustained powered controllable aeronautical flight.",
        impact: "Shrank the planetary globe from weeks of ocean travel to hours of flight.",
        description: "Orville Wright pilots the Flyer for 12 seconds covering 36.5 meters, opening the skies to global aviation."
      },
      {
        year: 1969,
        title: "Concorde Supersonic & Saturn V Moon Rocket",
        location: "Toulouse / Cape Canaveral",
        milestone: "Commercial passenger supersonic travel at Mach 2.04 alongside lunar launch vehicles.",
        impact: "Demonstrated peak aerospace propulsion capabilities in both atmosphere and vacuum.",
        description: "Concorde crossed the Atlantic Ocean in under 3.5 hours with delta-wings and afterburning Olympus turbojets."
      },
      {
        year: 2026,
        title: "Autonomous Electric Vehicles & Urban eVTOL",
        location: "Global Metropolises",
        milestone: "Zero-emission self-driving electric fleets and vertical takeoff electric aircraft.",
        impact: "Drastically reduced urban carbon emissions while automating point-to-point urban mobility.",
        description: "Solid-state batteries and real-time computer vision allow autonomous fleets to navigate complex street grids."
      },
      {
        year: 2100,
        title: "Planetary Maglev Vacuum Tubes & Orbital Tethers",
        location: "Trans-Continental Sub-Surface Tubes",
        milestone: "Evacuated hyper-speed magnetic levitation travelling at 4,000 km/h.",
        impact: "Crosses oceans in minutes with zero friction and launches cargo to orbit without rockets.",
        description: "Subterranean vacuum tubes link every continent on Earth, powered by geothermal and magnetic induction loops."
      }
    ]
  },
  {
    id: "ai",
    title: "History of Artificial Intelligence",
    iconName: "Sparkles",
    description: "The quest to replicate, augment, and transcend human cognition through mathematics and silicon.",
    timeSpan: "1950 — 2030+",
    steps: [
      {
        year: 1950,
        title: "Alan Turing Proposes the Imitation Game",
        location: "Manchester, England",
        milestone: "Foundational philosophical question: 'Can machines think?'",
        impact: "Established the Turing Test as the benchmark for artificial intelligence.",
        description: "Alan Turing publishes 'Computing Machinery and Intelligence', outlining programmed machine learning and heuristics."
      },
      {
        year: 1956,
        title: "The Dartmouth Workshop",
        location: "Hanover, New Hampshire",
        milestone: "Coined the term 'Artificial Intelligence' and launched the formal scientific field.",
        impact: "Gathered John McCarthy, Marvin Minsky, Claude Shannon, and Herbert Simon to outline machine cognition.",
        description: "The proposal asserted that every aspect of learning or intelligence can in principle be so precisely described that a machine can simulate it."
      },
      {
        year: 1997,
        title: "Deep Blue Defeats Garry Kasparov",
        location: "New York City, USA",
        milestone: "First computer program to defeat a reigning world chess champion in a standard tournament match.",
        impact: "Demonstrated brute-force parallel processing and specialized evaluation algorithms in complex strategic spaces.",
        description: "IBM's custom 32-node supercomputer evaluated 200 million chess board positions per second."
      },
      {
        year: 2012,
        title: "AlexNet & The Deep Learning Revolution",
        location: "Toronto, Canada",
        milestone: "Convolutional neural networks trained on GPUs achieve unprecedented visual recognition accuracy.",
        impact: "Sparked the modern deep learning boom across speech, vision, robotics, and natural language.",
        description: "Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton win ImageNet by a massive margin, validating backpropagation at scale."
      },
      {
        year: 2022,
        title: "The Transformer & Generative Foundation Boom",
        location: "Silicon Valley & Global Laboratories",
        milestone: "Large language and multimodal models demonstrate general reasoning and emergent in-context learning.",
        impact: "Brought natural conversational AI into everyday global use for coding, writing, research, and analysis.",
        description: "Attention-based Transformer architectures scaled to hundreds of billions of parameters exhibit reasoning capabilities."
      },
      {
        year: 2026,
        title: "Autonomous Agentic Reasoning & Gemini Systems",
        location: "Global Distributed Compute",
        milestone: "Self-correcting AI agents orchestrating scientific workflows, live multimodal perception, and software architectures.",
        impact: "Accelerates human scientific output across medicine, clean energy, and planetary exploration.",
        description: "Hybrid reasoning frameworks combine deep reinforcement learning, neural search, and live tool orchestration."
      }
    ]
  }
];
