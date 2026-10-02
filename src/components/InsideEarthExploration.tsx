import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import { audio } from "../services/audioService";
import {
  Layers,
  Flame,
  Thermometer,
  Compass,
  Globe,
  Sparkles,
  Timer,
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
  RotateCcw,
  Dna,
  ShieldAlert,
  ArrowRight,
  Tv,
  Zap,
  CheckCircle,
  HelpCircle,
  Eye,
  Activity,
  Compass as CompassIcon,
} from "lucide-react";

interface InsideEarthExplorationProps {
  currentYear: number;
  onWarpToYear: (year: number) => void;
  onGoHome: () => void;
}

// Earth layer depth thresholds (km)
const DEPTH_STAGES = [
  { name: "Exosphere / Space", min: -200, max: -80, temp: -150, press: "0 GPa", comp: "Hydrogen, Helium, Vacuum", desc: "The cold infinite vacuum of orbital space. Dynamic solar winds pass through Earth's magnetosphere.", activities: "Satellites, cosmic rays, solar radiation tracking" },
  { name: "Atmosphere & Clouds", min: -80, max: 0, temp: -50, press: "0.0001 GPa", comp: "Nitrogen, Oxygen, Argon, Water Vapor", desc: "The protective envelope shield of Earth. Atmospheric pressure drops exponentially with altitude.", activities: "Auroras, cloud formation, weather dynamics" },
  { name: "Continental Crust", min: 0, max: 40, temp: 25, press: "1 GPa", comp: "Granite, Basalt, Sedimentary Strata", desc: "The solid, fractured skin of our world. Tectonic plates drift on the convective mantle below.", activities: "Mountain formation, earthquake epicenters, volcanic eruptions" },
  { name: "Convective Mantle", min: 40, max: 2890, temp: 2200, press: "135 GPa", comp: "Silicates, Magnesium Oxide, Peridotite", desc: "A vast 2,900km layer of semi-fluid rock. Heat currents drive continental drift via convection.", activities: "Plume updrafts, magma reservoirs, plate subduction" },
  { name: "Liquid Outer Core", min: 2890, max: 5150, temp: 4500, press: "330 GPa", comp: "Liquid Iron, Nickel, Sulfur", desc: "A churning ocean of molten iron. Electrical currents here generate Earth's primary magnetic field.", activities: "Geodynamo convective loops, magnetic polar flips" },
  { name: "Solid Inner Core", min: 5150, max: 6371, temp: 6000, press: "360 GPa", comp: "Crystalline Iron-Nickel Alloy", desc: "A solid metallic sphere hotter than the surface of the Sun, locked in crystal state by immense pressure.", activities: "Core crystallization, gravitational stabilization" }
];

// Major locations with Past/Present/Future details
const TIME_LOCATIONS = [
  {
    id: "giza",
    name: "Giza Plateau, Egypt",
    coordinates: [29.9792, 31.1342],
    past: "Year -2560: 100,000 workers hauling limestone blocks. The Great Pyramid is completed, clad in brilliant white tura limestone with a golden pyramidion gleaming under the desert sun.",
    present: "Year 2026: Modern archeological surveys, heavy tourism, urban sprawl of Cairo directly touching the borders of the ancient plateau.",
    future: "Year 2100: speculative sub-surface scanning drones and hyper-magnetic archeo-domes protecting the ancient monoliths from desertification.",
    desc: "The cradle of geometric stone engineering and temporal alignment."
  },
  {
    id: "yellowstone",
    name: "Yellowstone Supervolcano",
    coordinates: [44.4280, -110.5885],
    past: "Year -640,000: A mega-eruption spewing 1,000 cubic kilometers of ash. The sky is black, pyroclastic flows level thousands of miles of forests, forming the current giant caldera.",
    present: "Year 2026: Hydrothermal geysers bubbling placidly. Seismometers monitoring constant micro-earthquakes and sub-crust magma chamber swelling.",
    future: "Year 5000: speculative geothermal siphon wells drawing energy directly from the plume to prevent supervolcanic overpressurization.",
    desc: "A massive magmatic engine sitting directly beneath the continental crust."
  },
  {
    id: "mariana",
    name: "Mariana Trench (Deep Ocean)",
    coordinates: [11.3493, 142.1996],
    past: "Year -180,000,000: Ocean floor subduction begins. The Pacific Plate dives beneath the Philippine Sea Plate, dragging water and carbon down into the upper mantle.",
    present: "Year 2026: Challenger Deep. Utter darkness, 1,000 atmospheres of pressure. Rare extremophile organisms thrive around hydrothermal serpentinite vents.",
    future: "Year 10000: Robotic deep-earth carbon sequestration pods pumping pressurized carbon isotopes into sub-oceanic basalt chambers.",
    desc: "The deepest scar on Earth, plunging 11 kilometers directly toward the mantle."
  },
  {
    id: "chicxulub",
    name: "Chicxulub Impact Site",
    coordinates: [21.4000, -89.5000],
    past: "Year -66,000,000: A 10km asteroid strikes at 20 km/s. Visualizing superheated plasma, global wildfires, mega-tsunamis, and nuclear winter that ended the Mesozoic Era.",
    present: "Year 2026: A buried impact ring covered by limestone and cenotes in the Yucatan Peninsula, analyzed by core drilling rigs.",
    future: "Year 2100: SPECULATIVE: Orbital defense arrays calibrated on historic asteroid telemetry to secure planetary preservation.",
    desc: "The scar of the dinosaur extinction, marking a critical evolutionary bottleneck."
  }
];

// Evolution Milestones
const EVOLUTION_STAGES = [
  { year: -3800000000, eraName: "Eoarchean", organism: "LUCA (Universal Ancestor)", description: "Single-celled extremophiles clustering around deep-sea hydrothermal vents, feeding on hydrogen and sulfur.", icon: "🔬" },
  { year: -541000000, eraName: "Cambrian", organism: "Trilobites & Anomalocaris", description: "The Cambrian Explosion. Marine life undergoes rapid diversification, developing hard shells, eyes, and early complex nervous systems.", icon: "🦐" },
  { year: -250000000, eraName: "Mesozoic", organism: "Tyrannosaurus Rex & Sauropods", description: "The Age of Reptiles. Massive dinosaurs dominate supercontinents, supported by humid, global greenhouse climates.", icon: "🦖" },
  { year: -20000, eraName: "Pleistocene", organism: "Mammoth & Neanderthals", description: "The Ice Age. Megafauna roam frozen tundras. Early humans craft stone tools, harness fire, and navigate glacial shifts.", icon: "🦣" },
  { year: 2026, eraName: "Anthropocene", organism: "Homo Sapiens & Digital Networks", description: "The digital age. Human civilization establishes global energy networks and starts launching telemetry probes into temporal streams.", icon: "🧠" },
  { year: 2100, eraName: "Speculative Future", organism: "Post-Biological Symbiotes", description: "SPECULATIVE: Integration of neural carbon interfaces with organic silicon computing, designed to withstand cosmic shifts.", icon: "🤖" }
];

// Speculative Future scenarios
const FUTURE_SCENARIOS = [
  { year: 2050, title: "Climate Resilience", description: "SPECULATIVE MODEL: High-density solar towers and active ocean thermal currents being siphoned for global cooling.", icon: "🌱" },
  { year: 2100, title: "Planetary Arcologies", description: "SPECULATIVE MODEL: Sub-surface geological cities housing millions in geothermal balance, utilizing advanced structural basalt polymers.", icon: "🏙️" },
  { year: 10000, title: "Tectonic Reshape", description: "SPECULATIVE MODEL: Measurable changes in coastline due to slow seafloor spreading. Redesigned deep geothermal grids.", icon: "🗺️" },
  { year: 50000000, title: "Pangea Ultima Begins", description: "SPECULATIVE MODEL: Shifting plates begin closing the Atlantic, merging Africa and Europe into a brand-new supercontinent.", icon: "🌋" },
  { year: 5000000000, title: "Red Giant Phase", description: "SPECULATIVE MODEL: The dying Sun expands, boiling away the oceans, melting Earth's crust back into a molten lava state like the Hadean Eon.", icon: "☀️" }
];

export const InsideEarthExploration: React.FC<InsideEarthExplorationProps> = ({
  currentYear,
  onWarpToYear,
  onGoHome,
}) => {
  // Navigation State
  const [depth, setDepth] = useState<number>(-200); // starts in space (-200km)
  const [isLiveEarth, setIsLiveEarth] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"LAYERS" | "EVOLUTION" | "FUTURE" | "LOCATIONS">("LAYERS");
  
  // Transition State
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionStatus, setTransitionStatus] = useState<string>("");
  const [shakeIntensity, setShakeIntensity] = useState<number>(0);
  const [plasmaGlow, setPlasmaGlow] = useState<boolean>(false);
  const [cloudOverlay, setCloudOverlay] = useState<boolean>(false);
  const [crustExplosion, setCrustExplosion] = useState<boolean>(false);

  // Time-Travel Spot Selection
  const [selectedSpot, setSelectedSpot] = useState<typeof TIME_LOCATIONS[0] | null>(null);
  const [spotEra, setSpotEra] = useState<"PAST" | "PRESENT" | "FUTURE">("PRESENT");

  // Three.js refs
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetGroupRef = useRef<THREE.Group | null>(null);
  const particleGroupRef = useRef<THREE.Group | null>(null);

  // Hidden Portals State
  const [foundPortals, setFoundPortals] = useState<string[]>([]);
  const [portalAlert, setPortalAlert] = useState<string | null>(null);

  // Active Layer
  const getActiveLayer = (d: number) => {
    return DEPTH_STAGES.find(stage => d >= stage.min && d <= stage.max) || DEPTH_STAGES[0];
  };
  const activeLayer = getActiveLayer(depth);

  // Portal discovery trigger
  const checkPortalDiscovery = (currentDepth: number) => {
    let portalFound: string | null = null;
    if (currentDepth > 5000 && !foundPortals.includes("CORE_SINGULARITY")) {
      portalFound = "CORE_SINGULARITY";
    } else if (currentDepth > 2000 && currentDepth < 2500 && currentYear <= -250000000 && !foundPortals.includes("DINO_POCKET")) {
      portalFound = "DINO_POCKET";
    } else if (currentDepth < -100 && currentYear > 50000000 && !foundPortals.includes("FUTURE_ORBITAL")) {
      portalFound = "FUTURE_ORBITAL";
    }

    if (portalFound) {
      audio.playHoloBeep();
      setFoundPortals(prev => [...prev, portalFound!]);
      setPortalAlert(portalFound);
    }
  };

  // Spectacular Smooth Entry Transition: Space -> Interior Core
  const triggerSmoothEntry = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    audio.playClick(900);

    // 1. Atmos entry (-200 -> -80)
    setTransitionStatus("INITIATING DESCENT SEQUENCE... PREPARING ORBITAL EXIT");
    await new Promise(r => setTimeout(r, 1200));

    setTransitionStatus("ATMOSPHERIC BURST: IONIZING OUTER LAYERS");
    setPlasmaGlow(true);
    setShakeIntensity(2);
    audio.playHoloBeep();
    
    // Smoothly update depth
    let stepDepth = -200;
    const interval = setInterval(() => {
      if (stepDepth < 6371) {
        stepDepth += 95;
        if (stepDepth > 6371) stepDepth = 6371;
        setDepth(stepDepth);
        checkPortalDiscovery(stepDepth);

        // Stage specific effects
        if (stepDepth >= -80 && stepDepth < 0) {
          setTransitionStatus("CLOUDS INTERCEPTED: MOISTURE SHIELD ENGAGED");
          setPlasmaGlow(false);
          setCloudOverlay(true);
          setShakeIntensity(1.5);
        } else if (stepDepth >= 0 && stepDepth < 40) {
          setTransitionStatus("SURFACE IN SIGHT... TARGETING CONTINENTAL CRUST PLATES");
          setCloudOverlay(false);
          setCrustExplosion(true);
          setShakeIntensity(4);
        } else if (stepDepth >= 40 && stepDepth < 2890) {
          setTransitionStatus("CRUST PENETRATION COMPLETE: DESCENDING INTO UPPER MANTLE");
          setCrustExplosion(false);
          setShakeIntensity(2);
        } else if (stepDepth >= 2890 && stepDepth < 5150) {
          setTransitionStatus("Molten OUTER CORE: LIQUID GEODYNAMO STRESS");
          setShakeIntensity(3);
        } else if (stepDepth >= 5150) {
          setTransitionStatus("CORE SYNCHRONIZATION ESTABLISHED: SOLID IRON NUCLEUS STABLE");
          setShakeIntensity(0.5);
        }
      } else {
        clearInterval(interval);
        setIsTransitioning(false);
        setShakeIntensity(0);
        audio.playHoloBeep();
      }
    }, 80);
  };

  // Reset back to Space
  const resetToSpace = () => {
    if (isTransitioning) return;
    audio.playClick(400);
    setDepth(-200);
    setSelectedSpot(null);
  };

  // Geological Era description helper
  const getGeologicalContext = (yr: number) => {
    if (yr <= -13000000000) return { eon: "PRE-SOLAR", title: "Cosmic Inflation Era", desc: "The Earth does not exist yet. Matter, space, and time are expanding rapidly from a single point.", atmosphere: "Superheated plasma", activity: "High cosmic inflation" };
    if (yr <= -4000000000) return { eon: "HADEAN EON", title: "Molten sulfur Oceans & Hellish Heat", desc: "Earth has just coalesced. Extreme volcanism, heavy asteroid impacts, and a glowing red lava landscape.", atmosphere: "Carbon dioxide, water vapor, methane", activity: "High core eruption" };
    if (yr <= -250000000) return { eon: "PHANEROZOIC EON", title: "Pangaea & Jurassic Wilderness", desc: "The supercontinent Pangaea covers the globe. Dense fern forests, carbon-heavy swamp atmospheres, and colossal reptilian dinosaurs.", atmosphere: "High oxygen and moisture", activity: "Tectonic drift" };
    if (yr <= -10000) return { eon: "ICE AGE", title: "Boreal Glaciation Peak", desc: "Ice sheets up to 3km thick cover vast areas of Europe and North America. Sea levels are 120m lower.", atmosphere: "Cold, dry, carbon-poor", activity: "Glacial movements" };
    if (yr <= 2026) return { eon: "ANTHROPOCENE", title: "Modern Industrial civilization", desc: "High carbon industrial outputs, digital communications grids, subduction plates mapped precisely.", atmosphere: "Nitrogen, oxygen, trace pollutants", activity: "Technosphere output" };
    return { eon: "SPECULATIVE FUTURE", title: "Simulated Planetary Horizon", desc: "SPECULATIVE: Post-carbon geo-engineering, smart crustal microgrids, and continent drift leading to Pangea Ultima.", atmosphere: "Controlled oxygen balance", activity: "Technological cooling siphons" };
  };
  const geoContext = getGeologicalContext(currentYear);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Dimensions
    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, 180);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(100, 100, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.6); // Cyan tech backlight
    dirLight2.position.set(-100, -100, -100);
    scene.add(dirLight2);

    // Planet group
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);
    planetGroupRef.current = planetGroup;

    // Render concentric shells of Earth based on depth
    const addEarthLayers = () => {
      // Clear previous layers
      while(planetGroup.children.length > 0){ 
        planetGroup.remove(planetGroup.children[0]); 
      }

      const isMolten = currentYear <= -4000000000;
      const isGlacial = currentYear > -50000 && currentYear <= -10000;

      // 1. Solid Core (Innermost)
      const coreGeo = new THREE.SphereGeometry(15, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: isMolten ? 0xff4500 : 0xffea00,
        emissive: isMolten ? 0xff3300 : 0xff9900,
        emissiveIntensity: 2.2,
        roughness: 0.1,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      planetGroup.add(core);

      // 2. Outer Core (Molten)
      const outerCoreGeo = new THREE.SphereGeometry(28, 32, 32);
      const outerCoreMat = new THREE.MeshStandardMaterial({
        color: 0xe65c00,
        emissive: 0xff4500,
        emissiveIntensity: 1.4,
        transparent: true,
        opacity: 0.65,
        wireframe: false,
      });
      const outerCore = new THREE.Mesh(outerCoreGeo, outerCoreMat);
      planetGroup.add(outerCore);

      // 3. Mantle
      const mantleGeo = new THREE.SphereGeometry(45, 32, 32);
      const mantleMat = new THREE.MeshStandardMaterial({
        color: isMolten ? 0xb32400 : 0x8a1c14,
        emissive: isMolten ? 0xff3300 : 0x4a0a05,
        emissiveIntensity: isMolten ? 1.6 : 0.45,
        transparent: true,
        opacity: 0.55,
      });
      const mantle = new THREE.Mesh(mantleGeo, mantleMat);
      planetGroup.add(mantle);

      // 4. Crust (Outer shell)
      const crustGeo = new THREE.SphereGeometry(52, 48, 48);
      
      let crustColor = 0x2e3a23; // standard continental green/brown
      if (isMolten) crustColor = 0x111115; // pitch volcanic black
      else if (isGlacial) crustColor = 0xe2e8f0; // glacial ice sheet white
      else if (currentYear > 2026) crustColor = 0x0f172a; // clean slate blue future

      const crustMat = new THREE.MeshStandardMaterial({
        color: crustColor,
        roughness: 0.85,
        transparent: true,
        opacity: 0.85,
        wireframe: false,
      });
      const crust = new THREE.Mesh(crustGeo, crustMat);
      planetGroup.add(crust);

      // Add elegant wireframe slices to represent structural scan grids
      const gridGeo = new THREE.SphereGeometry(52.5, 24, 24);
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const grid = new THREE.Mesh(gridGeo, gridMat);
      planetGroup.add(grid);
    };

    addEarthLayers();

    // Create particle convective current stream
    const particleCount = 120;
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    particleGroupRef.current = particleGroup;

    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Radiating from core outwards
      const radius = 15 + Math.random() * 37;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Bright fiery magma colors
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.4;
      colors[i * 3 + 2] = 0.0;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const pointsMesh = new THREE.Points(particlesGeo, pMat);
    particleGroup.add(pointsMesh);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Auto rotation representing Live Earth
      if (isLiveEarth && planetGroup) {
        planetGroup.rotation.y += 0.003;
        planetGroup.rotation.x += 0.001;
      }

      // Heat currents drifting radially
      if (particleGroup && pointsMesh) {
        const posArr = pointsMesh.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          // Push particles slightly outwards
          const x = posArr[i * 3];
          const y = posArr[i * 3 + 1];
          const z = posArr[i * 3 + 2];
          const len = Math.sqrt(x * x + y * y + z * z);

          if (len > 51) {
            // reset back to core
            const radius = 15;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            posArr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            posArr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            posArr[i * 3 + 2] = radius * Math.cos(phi);
          } else {
            const speed = 0.25;
            posArr[i * 3] += (x / len) * speed;
            posArr[i * 3 + 1] += (y / len) * speed;
            posArr[i * 3 + 2] += (z / len) * speed;
          }
        }
        pointsMesh.geometry.attributes.position.needsUpdate = true;
      }

      // Camera depth zoom simulation
      if (camera) {
        // map depth state from space (-200km) to core (6371km)
        // space (-200) -> z = 180
        // core (6371) -> z = 40 (inside)
        const targetZ = 180 - ((depth + 200) / (6371 + 200)) * 140;
        camera.position.z += (targetZ - camera.position.z) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [depth, currentYear, isLiveEarth]);

  const triggerPortalWarp = (targetYear: number) => {
    audio.playHoloBeep();
    onWarpToYear(targetYear);
    setPortalAlert(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden select-none">
      {/* Cinematic Overlays triggered by depth changes */}
      <AnimatePresence>
        {plasmaGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none border-[12px] border-orange-500/80 shadow-[inset_0_0_80px_rgba(249,115,22,0.9)]"
            style={{ filter: "blur(2px)" }}
          />
        )}

        {cloudOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-white/30 via-slate-100/10 to-transparent flex items-center justify-center"
          >
            <div className="text-sm font-mono text-cyan-300 font-bold bg-black/60 px-4 py-2 border border-cyan-400/30 rounded-xl animate-pulse">
              ATMOSPHERIC VAPOR PENETRATION ACTIVE
            </div>
          </motion.div>
        )}

        {crustExplosion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none bg-orange-950/40 border-[20px] border-red-500/40 flex items-center justify-center shadow-2xl"
          >
            <div className="text-center font-mono space-y-2">
              <span className="text-sm text-red-400 font-extrabold tracking-widest block animate-bounce">
                CRUST RE-ENTRY: SUB-SURFACE PENETRATOR DEPLOYED
              </span>
              <span className="text-[10px] text-slate-400 block">SEISMIC RUMBLE: {shakeIntensity}Hz</span>
            </div>
          </motion.div>
        )}

        {/* Portal Discovery Popup */}
        {portalAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-4 top-24 mx-auto max-w-md z-40 bg-purple-950/90 border border-purple-400/50 p-5 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)] backdrop-blur-xl text-center"
          >
            <div className="inline-flex p-3 rounded-xl bg-purple-900/60 border border-purple-400/40 text-purple-300 mb-3 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-mono font-black text-white uppercase tracking-wider">
              TEMPORAL PORTAL LOCATED!
            </h3>
            <p className="text-xs text-purple-200 mt-2 leading-relaxed">
              CHRONOS telemetry has decoded a secret quantum anomaly hiding inside the {activeLayer.name}.
            </p>
            
            <div className="mt-4 p-3 rounded-lg bg-black/50 border border-purple-500/20 text-left font-mono text-[10px] text-purple-300">
              {portalAlert === "CORE_SINGULARITY" && (
                <span>ANOMALY COORDINATE: Core singularity. Jumps straight into primordial Big Bang genesis eon.</span>
              )}
              {portalAlert === "DINO_POCKET" && (
                <span>ANOMALY COORDINATE: Mesozoic Rift. Visualizes the Jurassic ecosystem from 250M years ago.</span>
              )}
              {portalAlert === "FUTURE_ORBITAL" && (
                <span>ANOMALY COORDINATE: Horizon matrix. Accelerates timeline into the red giant terminal phase.</span>
              )}
            </div>

            <div className="mt-5 flex gap-2 justify-center">
              <button
                onClick={() => setPortalAlert(null)}
                className="px-3.5 py-1.5 rounded-lg border border-purple-500/40 text-purple-300 font-mono text-xs hover:bg-purple-950/50 transition cursor-pointer"
              >
                DISMISS
              </button>
              <button
                onClick={() => {
                  if (portalAlert === "CORE_SINGULARITY") triggerPortalWarp(-13800000000);
                  else if (portalAlert === "DINO_POCKET") triggerPortalWarp(-250000000);
                  else if (portalAlert === "FUTURE_ORBITAL") triggerPortalWarp(10000);
                }}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-white" />
                <span>ENTER PORTAL</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Exploration Screen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        
        {/* Left Side: Three.js Earth Cutaway Frame + Visualizer */}
        <div className="flex-1 min-h-[350px] lg:min-h-[500px] relative flex flex-col justify-between p-4">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-400/40 flex items-center justify-center shadow-lg">
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-sm font-mono font-black tracking-wider uppercase text-white">
                  GEOLOGICAL TIME-DEPTH MODULE
                </h1>
                <p className="text-[10px] font-mono text-cyan-400/80">
                  SPACE DEPLOYMENT: {depth === -200 ? "ORBITAL BOUNDARY" : `${depth} KM UNDERGROUND`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audio.playClick(850);
                  setIsLiveEarth(!isLiveEarth);
                }}
                className={`px-2.5 py-1 rounded bg-slate-900 border text-[10px] font-mono flex items-center gap-1 transition cursor-pointer ${
                  isLiveEarth
                    ? "border-emerald-500 text-emerald-300"
                    : "border-slate-800 text-slate-500"
                }`}
                title="Toggle Active Plate Rotation & Tectonics"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>LIVE TECTONICS: {isLiveEarth ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={onGoHome}
                className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-400 hover:text-white hover:border-slate-600 transition cursor-pointer"
              >
                EXIT MODE
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 w-full relative flex items-center justify-center my-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40">
            {/* Ambient Star Backdrop for Space stage */}
            {depth === -200 && (
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
            )}

            <div
              ref={mountRef}
              className="w-full h-full"
              style={{
                transform: shakeIntensity > 0 ? `translate(${(Math.random() - 0.5) * shakeIntensity}px, ${(Math.random() - 0.5) * shakeIntensity}px)` : "none",
                transition: "transform 0.05s linear",
              }}
            />

            {/* Cinematic HUD elements floating on Canvas */}
            <div className="absolute left-4 bottom-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md max-w-xs space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800/60 pb-1.5">
                <span>EON INTEGRATION</span>
                <span className="text-cyan-400 font-bold">{geoContext.eon}</span>
              </div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-tight leading-snug">
                {geoContext.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {geoContext.desc}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/50 text-[9px] font-mono">
                <div>
                  <span className="text-slate-500 block">ATMOSPHERE:</span>
                  <span className="text-slate-300 block font-medium truncate">{geoContext.atmosphere}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PLATE SPEED:</span>
                  <span className="text-slate-300 block font-medium">{isLiveEarth ? "12.4 cm/year" : "STABLE"}</span>
                </div>
              </div>
            </div>

            {/* Depth Slider bar overlaid on right side of Canvas */}
            <div className="absolute right-4 top-4 bottom-4 w-12 flex flex-col items-center justify-between bg-slate-950/80 border border-slate-800/80 rounded-xl py-3 px-1 backdrop-blur-md">
              <button
                onClick={() => {
                  audio.playClick(750);
                  setDepth(prev => Math.max(-200, prev - 45));
                }}
                disabled={depth <= -200}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-50"
                title="Ascend (Space)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              <div className="flex-1 w-1.5 bg-slate-900 rounded-full my-2 relative overflow-hidden">
                {/* Active Depth marker */}
                <div
                  className="absolute left-0 right-0 bg-cyan-500 transition-all duration-150"
                  style={{
                    bottom: 0,
                    top: `${100 - ((depth + 200) / (6371 + 200)) * 100}%`,
                  }}
                />
              </div>

              <span className="text-[9px] font-mono text-cyan-400 font-bold mb-1">
                {depth < 0 ? `${Math.abs(depth)}km` : `${depth}km`}
              </span>

              <button
                onClick={() => {
                  audio.playClick(650);
                  setDepth(prev => Math.min(6371, prev + 45));
                }}
                disabled={depth >= 6371}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-50"
                title="Descend to Core"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Portal Indicator inside UI if found */}
            {foundPortals.length > 0 && (
              <div className="absolute top-4 left-4 flex gap-1.5">
                {foundPortals.map(p => (
                  <span
                    key={p}
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 animate-pulse flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    {p.replace("_", " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Space to Deep Earth Travel Trigger Banner */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                onClick={triggerSmoothEntry}
                disabled={isTransitioning}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{depth === -200 ? "ENTER EARTH" : "TRAVEL THROUGH EARTH"}</span>
              </button>

              <button
                onClick={resetToSpace}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono transition cursor-pointer flex items-center gap-1"
                title="Reset Camera out to space Orbit"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET SPACE</span>
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block">CURRENT DEPTH COORDINATE</span>
              <span className="text-xs font-mono font-black text-cyan-300">
                {depth < 0 ? `ALTITUDE: ${Math.abs(depth)} KM` : `UNDERGROUND: ${depth} KM`}
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Tabbed Interface (Layers, Evolution, Locations, Future) */}
        <div className="w-full lg:w-[460px] border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col">
          
          {/* Tab buttons */}
          <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/40 text-[10px] font-mono font-bold text-center">
            <button
              onClick={() => { audio.playClick(700); setActiveTab("LAYERS"); }}
              className={`py-3 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === "LAYERS" ? "border-cyan-500 text-cyan-300 bg-cyan-950/10" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>LAYERS</span>
            </button>

            <button
              onClick={() => { audio.playClick(720); setActiveTab("EVOLUTION"); }}
              className={`py-3 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === "EVOLUTION" ? "border-purple-500 text-purple-300 bg-purple-950/10" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>EVOLUTION</span>
            </button>

            <button
              onClick={() => { audio.playClick(740); setActiveTab("LOCATIONS"); }}
              className={`py-3 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === "LOCATIONS" ? "border-yellow-500 text-yellow-300 bg-yellow-950/10" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>LOCATIONS</span>
            </button>

            <button
              onClick={() => { audio.playClick(760); setActiveTab("FUTURE"); }}
              className={`py-3 flex flex-col items-center gap-1 border-b-2 transition ${
                activeTab === "FUTURE" ? "border-rose-500 text-rose-300 bg-rose-950/10" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>FUTURES</span>
            </button>
          </div>

          {/* Drawer Content Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[500px] lg:max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-cyan-500/20">
            
            {activeTab === "LAYERS" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">ACTIVE LAYER SCANNER</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-500/20">
                    DIAGNOSTICS: OK
                  </span>
                </div>

                {/* Concentric Layer Specs */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-4 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {activeLayer.name}
                      </h3>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                        Depth: {activeLayer.min < 0 ? `Altitude ${Math.abs(activeLayer.min)}km` : `${activeLayer.min}km`} to {activeLayer.max}km
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed leading-relaxed">
                    {activeLayer.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/60">
                    <div className="flex items-start gap-2">
                      <Thermometer className="w-4 h-4 text-orange-400 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 block">TEMPERATURE</span>
                        <span className="text-xs font-mono font-bold text-orange-300">{activeLayer.temp}°C</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Flame className="w-4 h-4 text-red-400 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 block">PRESSURE</span>
                        <span className="text-xs font-mono font-bold text-red-300">{activeLayer.press}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 border border-slate-800/80 rounded-lg space-y-1 text-[10px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">COMPOSITION:</span>
                      <span className="text-slate-300 font-medium truncate max-w-[200px]">{activeLayer.comp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GEOLOGICAL ACTIVITY:</span>
                      <span className="text-slate-300 font-medium truncate max-w-[200px]">{activeLayer.activities}</span>
                    </div>
                  </div>
                </div>

                {/* Layer Quick Shortcuts list */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">WARP TO SPECIFIC LAYER</span>
                  <div className="grid grid-cols-2 gap-2">
                    {DEPTH_STAGES.map(stage => (
                      <button
                        key={stage.name}
                        onClick={() => {
                          audio.playClick(600);
                          setDepth(stage.min + 5);
                        }}
                        className={`p-2.5 rounded-lg border text-left font-mono text-[10px] transition cursor-pointer ${
                          activeLayer.name === stage.name
                            ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="block truncate">{stage.name}</span>
                        <span className="block text-[8px] text-slate-500 mt-0.5">Min: {stage.min}km</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "EVOLUTION" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">EVOLUTIONARY TRACKING MATRIX</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 font-mono border border-purple-500/30">
                    GENETIC CODE: STABLE
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Travel through Earth's biological timeline. Match your current year coordinate to trigger structural changes in atmosphere, continental placement, and cellular complexity.
                </p>

                <div className="space-y-3">
                  {EVOLUTION_STAGES.map((ev, idx) => {
                    const isMatched = currentYear === ev.year || 
                                     (ev.year === -3800000000 && currentYear < -1000000000) ||
                                     (ev.year === -250000000 && currentYear >= -400000000 && currentYear <= -100000000);
                    return (
                      <div
                        key={ev.organism}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isMatched
                            ? "bg-purple-950/20 border-purple-500 shadow-md"
                            : "bg-slate-900/60 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{ev.icon}</span>
                            <div>
                              <h4 className="text-xs font-mono font-bold text-white">{ev.organism}</h4>
                              <span className="text-[9px] font-mono text-slate-500 block mt-0.5">{ev.eraName}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              audio.playClick(1000);
                              onWarpToYear(ev.year);
                            }}
                            className={`px-2.5 py-1 rounded font-mono text-[9px] font-bold transition flex items-center gap-1 cursor-pointer ${
                              isMatched
                                ? "bg-purple-600 text-white"
                                : "bg-slate-950 border border-slate-700 text-slate-400 hover:text-white"
                            }`}
                          >
                            <Timer className="w-3 h-3" />
                            <span>{ev.year < 0 ? `${Math.abs(ev.year / 1000000).toFixed(0)}M BCE` : `${ev.year} CE`}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                          {ev.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "LOCATIONS" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">PLANETARY SCAN POINTS</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-yellow-950 text-yellow-300 font-mono border border-yellow-500/30">
                    LOC: SECTOR EARTH
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose a location coordinate to trigger a localized temporal jump. Analyze how local geography transforms from prehistoric eras into deep speculative futures.
                </p>

                <div className="space-y-2">
                  {TIME_LOCATIONS.map(spot => (
                    <div
                      key={spot.id}
                      onClick={() => {
                        audio.playClick(850);
                        setSelectedSpot(spot);
                        setSpotEra("PRESENT");
                      }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedSpot?.id === spot.id
                          ? "bg-yellow-950/20 border-yellow-500"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-yellow-400" />
                          <h4 className="text-xs font-mono font-bold text-white">{spot.name}</h4>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">[{spot.coordinates.join(", ")}]</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{spot.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Spot detail inspector with Past/Present/Future selector */}
                <AnimatePresence>
                  {selectedSpot && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-slate-900/90 border border-yellow-500/40 p-4 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase">
                          {selectedSpot.name} Inspector
                        </h4>
                        <button
                          onClick={() => setSelectedSpot(null)}
                          className="text-[10px] font-mono text-slate-500 hover:text-white"
                        >
                          CLOSE
                        </button>
                      </div>

                      {/* Era Selector buttons */}
                      <div className="grid grid-cols-3 gap-1 p-0.5 bg-black/60 border border-slate-800 rounded-lg text-[9px] font-mono text-center">
                        {(["PAST", "PRESENT", "FUTURE"] as const).map(era => (
                          <button
                            key={era}
                            onClick={() => {
                              audio.playClick(750);
                              setSpotEra(era);
                              // Trigger corresponding temporal jump based on spot
                              if (era === "PAST") {
                                if (selectedSpot.id === "giza") onWarpToYear(-2560);
                                else if (selectedSpot.id === "yellowstone") onWarpToYear(-640000);
                                else if (selectedSpot.id === "mariana") onWarpToYear(-180000000);
                                else if (selectedSpot.id === "chicxulub") onWarpToYear(-66000000);
                              } else if (era === "PRESENT") {
                                onWarpToYear(2026);
                              } else if (era === "FUTURE") {
                                if (selectedSpot.id === "giza") onWarpToYear(2100);
                                else if (selectedSpot.id === "yellowstone") onWarpToYear(5000);
                                else if (selectedSpot.id === "mariana") onWarpToYear(10000);
                                else if (selectedSpot.id === "chicxulub") onWarpToYear(2100);
                              }
                            }}
                            className={`py-1 rounded cursor-pointer ${
                              spotEra === era
                                ? "bg-yellow-500 text-black font-bold"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {era}
                          </button>
                        ))}
                      </div>

                      {/* Descriptive narrative */}
                      <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                        {spotEra === "PAST" && selectedSpot.past}
                        {spotEra === "PRESENT" && selectedSpot.present}
                        {spotEra === "FUTURE" && selectedSpot.future}
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                        <span>GEOGRAPHICAL ALIGNMENT: COMPLETE</span>
                        <span className="text-yellow-400">SELECT ERA ABOVE</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === "FUTURE" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">SPECULATIVE PLANETARY TRAJECTORIES</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-mono border border-rose-500/30">
                    SIMULATION CORE
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  SPECULATIVE FUTURES are generated through historical baseline algorithmic projections of solar growth, tectonic drift rates, and intelligent life climate footprints.
                </p>

                <div className="space-y-2">
                  {FUTURE_SCENARIOS.map(sc => (
                    <div
                      key={sc.year}
                      className="p-3 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{sc.icon}</span>
                          <h4 className="text-xs font-mono font-bold text-white">{sc.title}</h4>
                        </div>
                        <button
                          onClick={() => {
                            audio.playClick(1000);
                            onWarpToYear(sc.year);
                          }}
                          className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 hover:text-white border border-rose-800 text-[9px] font-mono font-bold transition cursor-pointer"
                        >
                          WARP {sc.year > 10000 ? `${(sc.year / 1000000).toFixed(0)}M YR` : `${sc.year}`}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed italic">
                        "{sc.description}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Embedded Geological Timeline */}
      <div className="border-t border-slate-800 bg-slate-950/90 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              GEOLOGICAL TIMELINE CALIBRATOR
            </span>
          </div>

          <span className="text-[10px] font-mono text-slate-400">
            Selected Year Coordinate: <span className="text-white font-bold">{currentYear < 0 ? `${Math.abs(currentYear).toLocaleString()} BC` : `${currentYear.toLocaleString()} CE`}</span>
          </span>
        </div>

        {/* Horizontal scrollable eons */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] font-mono">
          {[
            { name: "Pre-Solar Eon", year: -13800000000, color: "hover:bg-slate-900 hover:border-slate-700 border-slate-800/80 text-slate-400" },
            { name: "Hadean Eon", year: -4500000000, color: "hover:bg-orange-950/20 hover:border-orange-500/30 border-slate-800/80 text-orange-400" },
            { name: "Dino Eon", year: -250000000, color: "hover:bg-green-950/20 hover:border-green-500/30 border-slate-800/80 text-green-400" },
            { name: "Ice Age Eon", year: -20000, color: "hover:bg-blue-950/20 hover:border-blue-500/30 border-slate-800/80 text-cyan-400" },
            { name: "Anthropocene", year: 2026, color: "hover:bg-emerald-950/20 hover:border-emerald-500/30 border-slate-800/80 text-emerald-400" },
            { name: "Spec Future", year: 2100, color: "hover:bg-rose-950/20 hover:border-rose-500/30 border-slate-800/80 text-rose-400" }
          ].map(eon => {
            const isCurrentlyIn = currentYear === eon.year || 
                                  (eon.name === "Pre-Solar Eon" && currentYear < -5000000000) ||
                                  (eon.name === "Hadean Eon" && currentYear >= -4500000000 && currentYear < -1000000000) ||
                                  (eon.name === "Dino Eon" && currentYear >= -400000000 && currentYear <= -100000000);
            return (
              <button
                key={eon.name}
                onClick={() => {
                  audio.playClick(900);
                  onWarpToYear(eon.year);
                }}
                className={`py-2 px-3 rounded-lg border text-[10px] transition font-bold cursor-pointer ${
                  isCurrentlyIn
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : eon.color
                }`}
              >
                <span>{eon.name}</span>
                <span className="block text-[8px] text-slate-500 mt-0.5">
                  {eon.year < 0 ? `${Math.abs(eon.year / 1000000).toFixed(0)}M BCE` : `${eon.year}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
