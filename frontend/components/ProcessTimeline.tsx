"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ProcessTimeline({
  steps,
  title = "Our Process",
  subtitle = "We employ a structured, milestone-driven framework that guarantees transparency and precise execution.",
  className,
}: ProcessTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pathData, setPathData] = useState<string>("");

  // Track scroll progression through the timeline steps container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 75%"],
  });

  // Smooth out the line drawing with physical spring dynamics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Dynamically compute the smooth curved S-curve path connecting each step
  useEffect(() => {
    const computeCurvedPath = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2;

      // Extract accurate vertical centers for each step
      const points = stepRefs.current
        .map((el) => {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            x: centerX,
            y: rect.top - containerRect.top + rect.height / 2,
          };
        })
        .filter(Boolean) as { x: number; y: number }[];

      if (points.length < 2) return;

      // Deep, pronounced amplitude of the curve (sweeps generously into the open side of each row)
      const amplitude = Math.min(180, Math.max(100, containerRect.width * 0.18));

      // Start directly at the first node - purely curved with zero straight stubs
      let d = `M ${points[0].x} ${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const dy = p2.y - p1.y;

        // Sway dramatically towards the next phase:
        // When i is even, next card is on the right -> sweep wide right (+amplitude)
        // When i is odd, next card is on the left -> sweep wide left (-amplitude)
        const dir = i % 2 === 0 ? 1 : -1;
        const cpX = centerX + dir * amplitude;

        // Cubic Bézier control points with smooth rounded curvature
        const cp1Y = p1.y + dy * 0.36;
        const cp2Y = p2.y - dy * 0.36;

        d += ` C ${cpX} ${cp1Y}, ${cpX} ${cp2Y}, ${p2.x} ${p2.y}`;
      }

      setPathData(d);
    };

    computeCurvedPath();

    const handleResize = () => computeCurvedPath();
    window.addEventListener("resize", handleResize);

    // Recompute after slight delay to account for font or image rendering
    const timer = setTimeout(computeCurvedPath, 250);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [steps]);

  return (
    <section
      className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 border-t border-slate-200/60 dark:border-slate-900",
        className
      )}
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
            {subtitle}
          </p>
        )}
      </div>

      {/* Timeline Container */}
      <div ref={containerRef} className="relative max-w-5xl mx-auto">
        {/* SVG Curved Timeline Track & Animated Progress Line (positioned behind cards with z-0) */}
        {pathData && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0 overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="process-curve-gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <filter id="process-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Static Background Blueprint Curved Track */}
            <path
              d={pathData}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-slate-200/90 dark:text-slate-800"
              strokeDasharray="6 6"
            />

            {/* Animated Scroll-Driven Glowing Curved Line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="url(#process-curve-gradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: smoothProgress }}
              filter="url(#process-glow)"
            />
          </svg>
        )}

        {/* Process Steps */}
        <div className="space-y-12 sm:space-y-16">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={step.step || idx}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                  "flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10 w-full",
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Step Card (Opaque background so curve passes cleanly behind it) */}
                <div className="w-full md:w-[45%] bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-2xl shadow-md transition-all duration-300 relative z-10 overflow-hidden group">
                  {/* Stylized background phase number */}
                  <span className="absolute right-6 top-6 text-7xl font-extrabold text-slate-100 dark:text-slate-800/80 select-none group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    {step.step}
                  </span>

                  <div className="relative z-10 text-left space-y-3">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
                      Phase {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Central Checkpoint Node Marker - Reveals when reached via scrolling */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Subtle pulse wave on arrival */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{
                        scale: [1, 1.8, 2.2],
                        opacity: [0.7, 0.35, 0],
                      }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        delay: 0.25,
                        duration: 1.2,
                        ease: "easeOut",
                      }}
                      className="absolute w-7 h-7 rounded-full bg-blue-500 pointer-events-none"
                    />

                    {/* Central node pill */}
                    <div className="relative w-7 h-7 rounded-full border-4 border-white dark:border-slate-950 bg-blue-600 shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform group-hover:scale-110">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Spacer to balance two-column alternating flex layout */}
                <div className="w-full md:w-[45%] hidden md:block" aria-hidden="true" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
