"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

const ORIGINAL_GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [18.5204, 73.8567], size: 0.1 }, // Pune, India
    { location: [25.2048, 55.2708], size: 0.08 }, // Dubai, UAE
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export function Globe({
  className,
  config = ORIGINAL_GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let globeInstance: ReturnType<typeof createGlobe> | null = null;

    const measureAndInit = () => {
      const measured = container.offsetWidth || canvas.offsetWidth || 440;
      widthRef.current = Math.max(measured, 300);

      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2, 2);

      if (globeInstance) {
        globeInstance.destroy();
      }

      globeInstance = createGlobe(canvas, {
        ...config,
        width: widthRef.current * dpr,
        height: widthRef.current * dpr,
        devicePixelRatio: dpr,
        onRender: (state) => {
          if (!pointerInteracting.current) {
            phiRef.current += 0.004;
          }
          state.phi = phiRef.current + rs.get();
          state.width = widthRef.current * dpr;
          state.height = widthRef.current * dpr;
        },
      });

      canvas.style.opacity = "1";
    };

    measureAndInit();

    const resizeObserver = new ResizeObserver(() => {
      if (container) {
        const newWidth = container.offsetWidth;
        if (newWidth > 0 && Math.abs(newWidth - widthRef.current) > 20) {
          measureAndInit();
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (globeInstance) {
        globeInstance.destroy();
      }
    };
  }, [rs, config]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[460px] flex items-center justify-center select-none",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full aspect-square opacity-0 transition-opacity duration-700 cursor-grab active:cursor-grabbing block"
        style={{ width: "100%", height: "100%", aspectRatio: "1 / 1" }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
