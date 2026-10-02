import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface WormholeSceneProps {
  isWarping: boolean;
  warpSpeedFactor?: number;
  atmosphereColor?: string;
  year?: number;
}

export const WormholeScene: React.FC<WormholeSceneProps> = ({
  isWarping,
  warpSpeedFactor = 1,
  atmosphereColor = "#06b6d4",
  year = 2026,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number>(0);
  const speedRef = useRef<number>(0.5);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 1. Hyperspace Starfield / Particle Stream
    const starCount = 3500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starVelocities = new Float32Array(starCount);
    const starOriginalZ = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const radius = 15 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      starPositions[i * 3] = Math.cos(theta) * radius;
      starPositions[i * 3 + 1] = Math.sin(theta) * radius;
      const zPos = (Math.random() - 0.5) * 1600;
      starPositions[i * 3 + 2] = zPos;
      starOriginalZ[i] = zPos;
      starVelocities[i] = 1 + Math.random() * 3;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    // Custom glowing particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(100,220,255,0.8)");
    grad.addColorStop(0.8, "rgba(10,50,150,0.2)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const starMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(atmosphereColor),
      size: 3.5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 2. Concentric Chrono Warp Rings
    const ringCount = 14;
    const ringsGroup = new THREE.Group();
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(atmosphereColor),
      transparent: true,
      opacity: 0.35,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.TorusGeometry(35 + i * 2, 0.4, 8, 48);
      const ringMesh = new THREE.Mesh(ringGeo, ringMaterial.clone());
      ringMesh.position.z = -i * 120;
      ringsGroup.add(ringMesh);
    }
    scene.add(ringsGroup);

    // 3. Central Temporal Wormhole Core Vortex
    const vortexGeo = new THREE.CylinderGeometry(15, 65, 800, 32, 32, true);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(atmosphereColor),
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const vortex = new THREE.Mesh(vortexGeo, vortexMat);
    vortex.rotation.x = Math.PI / 2;
    vortex.position.z = -300;
    scene.add(vortex);

    // Resize handler with ResizeObserver
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Mouse interactive tilt
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Target speed calculation
      const targetSpeed = isWarping ? 25 * warpSpeedFactor : 0.8;
      speedRef.current += (targetSpeed - speedRef.current) * 0.05;

      // Update stars positions along Z
      const positions = starGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += starVelocities[i] * speedRef.current * 8 * (isWarping ? 3 : 1);
        if (positions[i * 3 + 2] > camera.position.z + 100) {
          positions[i * 3 + 2] = -1200;
        }
      }
      starGeometry.attributes.position.needsUpdate = true;

      // Rotate starfield and vortex
      starField.rotation.z += 0.001 * (isWarping ? 5 : 1);
      vortex.rotation.y += 0.003 * (isWarping ? 4 : 1);

      // Rings flight animation
      ringsGroup.children.forEach((ring, idx) => {
        ring.position.z += speedRef.current * 12;
        ring.rotation.z += (idx % 2 === 0 ? 1 : -1) * 0.005;
        if (ring.position.z > camera.position.z + 50) {
          ring.position.z = -1400;
        }
      });

      // Camera tilt towards cursor
      camera.position.x += (mouseX * 20 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 20 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, -300);

      // Camera FOV expansion during warp
      const targetFov = isWarping ? 95 : 75;
      camera.fov += (targetFov - camera.fov) * 0.08;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      particleTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isWarping, warpSpeedFactor, atmosphereColor]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      id="wormhole-canvas-container"
    />
  );
};
