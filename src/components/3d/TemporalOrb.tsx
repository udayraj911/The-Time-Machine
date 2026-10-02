import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface TemporalOrbProps {
  currentYear: number;
  highlightCoordinates?: [number, number]; // [lat, lng]
  locationName?: string;
  themeColor?: string;
}

export const TemporalOrb: React.FC<TemporalOrbProps> = ({
  currentYear,
  highlightCoordinates = [0, 0],
  locationName = "Sector Earth",
  themeColor = "#38bdf8",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef<boolean>(false);
  const prevMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Add Scene Lighting for Standard Materials
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.3);
    directionalLight1.position.set(120, 80, 100);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(new THREE.Color(themeColor), 0.5);
    directionalLight2.position.set(-120, -80, -100);
    scene.add(directionalLight2);

    // Procedural Planet Texture Generator
    const generateProceduralPlanetMaps = (year: number) => {
      const width = 1024;
      const height = 512;
      
      const mapCanvas = document.createElement("canvas");
      mapCanvas.width = width;
      mapCanvas.height = height;
      const mapCtx = mapCanvas.getContext("2d")!;
      
      const emissiveCanvas = document.createElement("canvas");
      emissiveCanvas.width = width;
      emissiveCanvas.height = height;
      const emCtx = emissiveCanvas.getContext("2d")!;
      
      if (year <= -13000000000) {
        // Cosmic Singularity / Big Bang
        const grad = mapCtx.createRadialGradient(512, 256, 0, 512, 256, 400);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.15, "#fcd34d");
        grad.addColorStop(0.4, "#f97316");
        grad.addColorStop(0.7, "#dc2626");
        grad.addColorStop(1, "#311042");
        mapCtx.fillStyle = grad;
        mapCtx.fillRect(0, 0, width, height);

        // Swirling dust plasma
        mapCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
        for (let i = 0; i < 30; i++) {
          mapCtx.beginPath();
          mapCtx.arc(Math.random() * width, Math.random() * height, 40 + Math.random() * 100, 0, Math.PI * 2);
          mapCtx.fill();
        }
        
        // Emissive is identical for cosmic glow
        emCtx.drawImage(mapCanvas, 0, 0);
        return { map: mapCanvas, emissive: emissiveCanvas };
      }
      
      if (year <= -4000000000) {
        // Hadean - Volcanic Molten Crust
        mapCtx.fillStyle = "#111115"; // Dark obsidian crust
        mapCtx.fillRect(0, 0, width, height);
        
        emCtx.fillStyle = "#000000";
        emCtx.fillRect(0, 0, width, height);
        
        // Basalt blobs
        mapCtx.fillStyle = "#1e1b29";
        for (let i = 0; i < 20; i++) {
          mapCtx.beginPath();
          mapCtx.arc(Math.random() * width, Math.random() * height, 70 + Math.random() * 90, 0, Math.PI * 2);
          mapCtx.fill();
        }
        
        // Lava Cracks (Emissive)
        emCtx.strokeStyle = "#ef4444";
        emCtx.lineWidth = 3;
        for (let i = 0; i < 25; i++) {
          emCtx.beginPath();
          emCtx.moveTo(Math.random() * width, Math.random() * height);
          for (let j = 0; j < 4; j++) {
            emCtx.lineTo(Math.random() * width, Math.random() * height);
          }
          emCtx.stroke();
        }

        // Active lava eruptions
        emCtx.fillStyle = "#f97316";
        for (let i = 0; i < 12; i++) {
          emCtx.beginPath();
          emCtx.arc(Math.random() * width, Math.random() * height, 20 + Math.random() * 35, 0, Math.PI * 2);
          emCtx.fill();
        }
        
        // Blend lava to surface map
        mapCtx.globalAlpha = 0.8;
        mapCtx.drawImage(emissiveCanvas, 0, 0);
        mapCtx.globalAlpha = 1.0;
        
        return { map: mapCanvas, emissive: emissiveCanvas };
      }
      
      // Standard Planet (Ocean background)
      mapCtx.fillStyle = "#081e3f"; // Deep navy ocean
      mapCtx.fillRect(0, 0, width, height);
      
      emCtx.fillStyle = "#000000";
      emCtx.fillRect(0, 0, width, height);
      
      const drawContinentBlob = (ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Sub-islands for fractal reality
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          const ang = Math.random() * Math.PI * 2;
          const dist = 0.5 + Math.random() * 0.5;
          const bx = cx + Math.cos(ang) * rx * dist;
          const by = cy + Math.sin(ang) * ry * dist;
          ctx.arc(bx, by, (rx + ry) * 0.18 * (0.4 + Math.random() * 0.6), 0, Math.PI * 2);
          ctx.fill();
        }
      };
      
      if (year <= -100000000) {
        // Dinosaurs Pangaea Supercontinent
        drawContinentBlob(mapCtx, 512, 256, 340, 180, "#0f5132"); // Lush ferns
        drawContinentBlob(mapCtx, 460, 240, 200, 110, "#5a3a1a"); // Dry interior
        
        // Accentuate shores
        mapCtx.strokeStyle = "#10b981";
        mapCtx.lineWidth = 1.5;
        mapCtx.stroke();
      } else if (year <= -10000) {
        // Ice Age - Glaciated Continents
        // Outline continents
        drawContinentBlob(mapCtx, 720, 200, 200, 100, "#3f3f46"); // Dark cold tundra
        drawContinentBlob(mapCtx, 240, 240, 110, 150, "#3f3f46");
        
        // Glacial cover (White ice sheets)
        mapCtx.fillStyle = "#f1f5f9";
        mapCtx.fillRect(0, 0, width, 190); // Glaciers covering Northern hemisphere
        mapCtx.fillRect(0, 390, width, 122); // Glaciers covering Southern hemisphere
        
        // Scattered ice packs
        for (let i = 0; i < 15; i++) {
          mapCtx.beginPath();
          mapCtx.arc(Math.random() * width, 190 + Math.random() * 110, 35 + Math.random() * 60, 0, Math.PI * 2);
          mapCtx.fill();
        }
      } else {
        // Ancient, Modern, and Speculative Future (Modern continental drift positions)
        // Europe/Asia (Lush green)
        drawContinentBlob(mapCtx, 740, 210, 200, 95, "#14532d");
        // Africa (Desert ochre core)
        drawContinentBlob(mapCtx, 630, 330, 115, 80, "#a16207");
        // North America
        drawContinentBlob(mapCtx, 220, 200, 100, 75, "#15803d");
        // South America
        drawContinentBlob(mapCtx, 280, 350, 75, 110, "#166534");
        // Australia
        drawContinentBlob(mapCtx, 860, 370, 70, 45, "#b45309");
        
        // Arctic Ice
        mapCtx.fillStyle = "#ffffff";
        mapCtx.fillRect(0, 0, width, 45);
        mapCtx.fillRect(0, 480, width, 32);
        
        // City Lights & Future Networks
        if (year >= -2560 && year < 1850) {
          // Ancient to Renaissance - subtle flame torch points
          emCtx.fillStyle = "#fbbf24";
          const ancientCenters = [
            [720, 200], // Rome
            [680, 240], // Cairo/Giza
            [650, 230], // Greece
            [850, 215], // Xian/Chang'an
            [800, 260], // India
            [260, 320], // Mesoamerica
          ];
          ancientCenters.forEach(([cx, cy]) => {
            emCtx.beginPath();
            emCtx.arc(cx, cy, 3.5, 0, Math.PI * 2);
            emCtx.fill();
            
            const rG = emCtx.createRadialGradient(cx, cy, 0, cx, cy, 12);
            rG.addColorStop(0, "rgba(251, 191, 36, 0.5)");
            rG.addColorStop(1, "rgba(0,0,0,0)");
            emCtx.fillStyle = rG;
            emCtx.beginPath();
            emCtx.arc(cx, cy, 12, 0, Math.PI * 2);
            emCtx.fill();
          });
        } else if (year >= 1850 && year <= 2026) {
          // Modern electrification
          emCtx.fillStyle = "#fef08a";
          const drawModernCity = (cx: number, cy: number, pwr: number) => {
            emCtx.fillStyle = "#fef08a";
            emCtx.beginPath();
            emCtx.arc(cx, cy, pwr, 0, Math.PI * 2);
            emCtx.fill();
            
            // Web wires
            emCtx.strokeStyle = "rgba(254, 240, 138, 0.12)";
            emCtx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
              emCtx.beginPath();
              emCtx.moveTo(cx, cy);
              emCtx.lineTo(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 60);
              emCtx.stroke();
            }
          };
          
          drawModernCity(240, 185, 4.5); // East Coast US
          drawModernCity(180, 205, 3.5); // West Coast US
          drawModernCity(710, 165, 4.8); // Western Europe
          drawModernCity(740, 180, 3.0); // Moscow
          drawModernCity(880, 200, 5.0); // Tokyo/Japan
          drawModernCity(840, 225, 4.2); // Coastal China
          drawModernCity(790, 265, 3.8); // India
        } else if (year > 2026) {
          // Speculative Future: Unified planetary energy grids
          emCtx.strokeStyle = "rgba(6, 182, 212, 0.25)";
          emCtx.lineWidth = 1.2;
          
          // Latitude rings of clean energy transmission
          for (let yPos = 130; yPos < 390; yPos += 50) {
            emCtx.beginPath();
            emCtx.moveTo(0, yPos);
            emCtx.lineTo(width, yPos);
            emCtx.stroke();
          }
          
          // Floating planetary hub rings
          const futureHubs = [
            [240, 185], [180, 205], [710, 165], [880, 200], [840, 225], [790, 265], [640, 350]
          ];
          futureHubs.forEach(([cx, cy]) => {
            emCtx.strokeStyle = "#a855f7"; // Magenta orbital ring anchors
            emCtx.lineWidth = 1.8;
            emCtx.beginPath();
            emCtx.arc(cx, cy, 15, 0, Math.PI * 2);
            emCtx.stroke();
            
            emCtx.fillStyle = "#ffffff";
            emCtx.beginPath();
            emCtx.arc(cx, cy, 4.5, 0, Math.PI * 2);
            emCtx.fill();
            
            const rG = emCtx.createRadialGradient(cx, cy, 0, cx, cy, 35);
            rG.addColorStop(0, "rgba(6, 182, 212, 0.75)");
            rG.addColorStop(0.5, "rgba(168, 85, 247, 0.35)");
            rG.addColorStop(1, "rgba(0,0,0,0)");
            emCtx.fillStyle = rG;
            emCtx.fillRect(cx - 35, cy - 35, 70, 70);
          });
        }
      }
      
      return { map: mapCanvas, emissive: emissiveCanvas };
    };

    const maps = generateProceduralPlanetMaps(currentYear);
    const textureMap = new THREE.CanvasTexture(maps.map);
    const textureEmissive = new THREE.CanvasTexture(maps.emissive);

    // 1. High-Fidelity 3D Lit Earth Sphere
    const sphereRadius = 55;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: textureMap,
      roughness: 0.7,
      metalness: 0.15,
      emissiveMap: textureEmissive,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: currentYear > 2026 ? 1.4 : currentYear < -4000000000 ? 1.8 : 0.95,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    orbGroup.add(sphereMesh);

    // Outer atmospheric shield glow
    const innerGeo = new THREE.SphereGeometry(sphereRadius * 1.03, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColor),
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    orbGroup.add(innerMesh);

    // 2. Latitude and Longitude Grid Rings
    const ringGeo1 = new THREE.RingGeometry(sphereRadius + 10, sphereRadius + 11, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.3;
    orbGroup.add(ringMesh1);

    const ringGeo2 = new THREE.RingGeometry(sphereRadius + 22, sphereRadius + 22.5, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 3;
    orbGroup.add(ringMesh2);

    // 3. Historical Nexus Coordinate Beacon Pin
    const [lat, lng] = highlightCoordinates;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(sphereRadius * Math.sin(phi) * Math.cos(theta));
    const z = sphereRadius * Math.sin(phi) * Math.sin(theta);
    const y = sphereRadius * Math.cos(phi);

    const pinGroup = new THREE.Group();
    const pinGeo = new THREE.SphereGeometry(2.8, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff"),
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(x, y, z);
    pinGroup.add(pinMesh);

    // Pulsing halo around beacon
    const haloGeo = new THREE.RingGeometry(3.5, 5, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(x * 1.05, y * 1.05, z * 1.05);
    haloMesh.lookAt(x * 2, y * 2, z * 2);
    pinGroup.add(haloMesh);

    orbGroup.add(pinGroup);

    // Mouse drag interaction
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - prevMouse.current.x;
      const deltaY = e.clientY - prevMouse.current.y;
      targetRotation.current.y += deltaX * 0.008;
      targetRotation.current.x += deltaY * 0.008;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Auto resize
    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    let pulseTime = 0;
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      pulseTime += 0.05;

      if (!isDragging.current) {
        targetRotation.current.y += 0.004;
      }

      orbGroup.rotation.y += (targetRotation.current.y - orbGroup.rotation.y) * 0.1;
      orbGroup.rotation.x += (targetRotation.current.x - orbGroup.rotation.x) * 0.1;

      ringMesh1.rotation.z += 0.008;
      ringMesh2.rotation.z -= 0.005;

      const scale = 1 + Math.sin(pulseTime * 3) * 0.3;
      haloMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
    };
  }, [currentYear, highlightCoordinates, themeColor]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-2 text-center pointer-events-none bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/20 text-xs text-cyan-300 font-mono tracking-wider">
        CHRONO-COORDINATE: {locationName} [{highlightCoordinates[0].toFixed(2)}°, {highlightCoordinates[1].toFixed(2)}°]
      </div>
    </div>
  );
};
