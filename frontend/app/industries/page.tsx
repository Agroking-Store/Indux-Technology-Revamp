"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Leaf, Factory, ShoppingBag, ArrowUpRight } from "lucide-react";

// --- Industry Data ---
const industries = [
  {
    id: "01",
    title: "Healthcare",
    subtitle: "Privacy-Preserving Diagnostics",
    description: "Engineering secure diagnostic engines and encrypted health matrices. We build systems ensuring zero-knowledge patient data protection without sacrificing computational power.",
    tags: ["Homomorphic Encryption", "Secure Flow", "Diagnostic AI"],
    icon: Activity,
    image: "https://images.unsplash.com/photo-1576091160550-2173ff9e9e9c?q=80&w=1600&auto=format&fit=crop",
    color: "bg-blue-500",
  },
  {
    id: "02",
    title: "Agri-Tech",
    subtitle: "Autonomous Crop Intelligence",
    description: "Deploying deep learning tools and convolutional neural networks for autonomous crop health analysis. We turn raw visual data into actionable agricultural insights.",
    tags: ["CNN / PyTorch", "Computer Vision", "Yield Ops"],
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1600&auto=format&fit=crop",
    color: "bg-emerald-500",
  },
  {
    id: "03",
    title: "Manufacturing",
    subtitle: "Process Validation & Analytics",
    description: "Architecting complex raw material tracking and interactive statistics dashboards. We streamline supply chains and automate compliance for high-stakes industrial operations.",
    tags: ["PostgreSQL", "BI Dashboards", "Process Auditing"],
    icon: Factory,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
    color: "bg-cyan-500",
  },
  {
    id: "04",
    title: "Retail & E-Com",
    subtitle: "Generative Personalization",
    description: "Building scalable generative styling engines that leverage computer vision to recommend highly personalized outfits, driving next-generation retail experiences.",
    tags: ["Generative AI", "Real-time AI", "React Native"],
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop",
    color: "bg-indigo-500",
  },
];

// --- Individual Stacking Card Component ---
const StackingCard = ({ 
  industry, 
  index,
  totalCards,
  progress, 
}: any) => {
  const containerRef = useRef(null);

  // --- MATHEMATICAL FIX ---
  // The exact percentage of the scroll where the *next* card hits the top of the screen.
  const startShrink = (index + 1) / (totalCards - 1);
  const targetScale = 1 - (totalCards - index) * 0.04;
  const isLastCard = index === totalCards - 1;

  // We explicitly bypass the animation for the last card so it NEVER shrinks or blurs.
  // For all other cards, they remain at scale: 1 and blur: 0 until `startShrink` is reached.
  const scale = isLastCard ? 1 : useTransform(progress, [startShrink, 1], [1, targetScale]);
  const opacity = isLastCard ? 1 : useTransform(progress, [startShrink, 1], [1, 0.3]);
  const blur = isLastCard ? "blur(0px)" : useTransform(progress, [startShrink, 1], ["blur(0px)", "blur(12px)"]);

  // Internal image parallax (moves opposite to the scroll for a cinematic feel)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });
  const imageParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);

  const Icon = industry.icon;

  return (
    <div ref={containerRef} className="sticky top-0 flex h-screen w-full items-center justify-center">
      <motion.div
        style={{ scale, opacity, filter: blur }}
        className="relative flex h-[500px] w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-900/5 md:h-[600px] md:flex-row"
      >
        
        {/* Left Side: Content */}
        <div className="flex h-full w-full flex-col justify-between p-8 md:w-[45%] md:p-14 lg:p-16">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${industry.color} text-white shadow-lg`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-6xl font-black tracking-tighter text-slate-100">
                {industry.id}
              </span>
            </div>

            <h3 className="mb-2 text-sm font-black uppercase tracking-widest text-slate-400">
              {industry.title}
            </h3>
            <h4 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {industry.subtitle}
            </h4>
            
            <p className="max-w-md text-base font-medium leading-relaxed text-slate-600">
              {industry.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {industry.tags.map((tag: string, i: number) => (
                <span key={i} className="rounded-full bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 ring-1 ring-inset ring-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Image with Parallax */}
        <div className="relative h-full w-full overflow-hidden bg-slate-100 md:w-[55%]">
          <motion.img
            style={{ y: imageParallax }}
            src={industry.image}
            alt={industry.title}
            className="absolute -top-[10%] h-[120%] w-full object-cover"
          />
          
          {/* Explore Button overlaying the image */}
          <div className="absolute bottom-8 right-8 z-10">
            <button className="group flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition-transform hover:scale-110">
              <ArrowUpRight className="h-6 w-6 transition-transform group-hover:rotate-45" />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// --- Main Page Component ---
export default function LimitlessIndustries() {
  const container = useRef(null);
  
  // Tracks the scroll progress of the entire stack container
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <main className="bg-slate-50 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-2 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Ecosystem Impact
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl font-extrabold tracking-tighter text-slate-950 sm:text-7xl lg:text-8xl"
        >
          Industries <span className="text-slate-400">We Serve.</span>
        </motion.h1>
      </section>

      {/* The Sticky Stacking Deck Container */}
      <section ref={container} className="relative w-full">
        {industries.map((industry, index) => (
          <StackingCard 
            key={industry.id} 
            industry={industry} 
            index={index}
            totalCards={industries.length}
            progress={scrollYProgress}
          />
        ))}
      </section>

      {/* Footer Spacer (To prove you can scroll out of the stack smoothly) */}
      <section className="flex h-[50vh] items-center justify-center bg-slate-950 text-white">
        <h2 className="text-3xl font-bold tracking-tight">Ready to build?</h2>
      </section>
      
    </main>
  );
}