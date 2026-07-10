"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, Sprout, ShieldCheck, BarChart3, X, ChevronRight, ChevronLeft } from "lucide-react";

// --- Project Data ---
const projects = [
  {
    id: 1,
    title: "Indux CRM",
    category: "CRM & Sales",
    description: "Engineered a highly scalable generative styling engine leveraging computer vision to recommend highly personalized outfits in real-time, driving a 40% increase in user retention.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Bill Tea",
    category: "Enterprise",
    description: "Developed a deep learning diagnostic tool utilizing Convolutional Neural Networks (CNNs) to analyze crop health from anonymous uploads, processing over 10,000 images daily.",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "JEM Soft",
    category: "Insurance",
    description: "Architected a secure symptom matrix system that communicates with remote servers utilizing advanced CKKS Homomorphic Encryption, ensuring zero-knowledge privacy.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Sales Automation",
    category: "Artificial Intelligence",
    description: "Built a complex raw material tracking and interactive statistics dashboard designed for high-stakes industrial operations, streamlining the entire supply chain.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Indux ERP",
    category: "Operations",
    description: "A comprehensive Enterprise Resource Planning suite that unifies finance, supply chain, and human resources into a single, cohesive, high-performance ecosystem.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Dnyaypath",
    category: "Legal ERP",
    description: "A specialized legal practice management system designed to automate case tracking, client communications, and secure document storage for massive law firms.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Ultimate3DShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Background Ambient Light Effect
  // Smoothly transitions the background image based on the active card to create a glowing bleed effect
  const activeProject = projects[activeIndex];
  const expandedProject = projects.find((p) => p.id === expandedId);

  // Keyboard Navigation for the 3D Carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedId) return; // Disable when modal is open
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedId]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 py-24 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* Ambient Background Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 -z-10 bg-cover bg-center blur-[100px]"
          style={{ backgroundImage: `url(${activeProject.image})` }}
        />
      </AnimatePresence>

      <div className="mx-auto flex h-full max-w-7xl flex-col items-center px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200/60 bg-white/40 px-6 py-2 shadow-sm backdrop-blur-md"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Featured Ecosystem
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl font-extrabold tracking-tighter text-slate-950 sm:text-6xl"
          >
            Explore <span className="text-slate-400">Our</span> Solutions.
          </motion.h2>
        </div>

        {/* --- 3D Depth Carousel --- */}
        {/* The perspective style is crucial for the 3D rotateY effect */}
        <div className="relative flex h-[500px] w-full items-center justify-center" style={{ perspective: "1200px" }}>
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            const isPastLimit = absOffset > 2; // Hide cards that are too far away

            return (
              <motion.div
                key={project.id}
                layoutId={`card-container-${project.id}`}
                onClick={() => {
                  if (isActive) {
                    setExpandedId(project.id);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                // Core 3D Math Logic
                animate={{
                  x: offset * 220, // Horizontal spread
                  scale: 1 - absOffset * 0.15, // Cards get smaller the further they are
                  rotateY: offset * -25, // Cards tilt inward towards the center
                  z: absOffset * -150, // Pushes inactive cards back into the screen
                  opacity: isPastLimit ? 0 : 1 - absOffset * 0.2, // Fade out distant cards
                  zIndex: 10 - absOffset, // Ensure center card is always on top
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
                className={`absolute flex h-[400px] w-[320px] origin-center flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-shadow duration-300 md:h-[450px] md:w-[350px] ${isActive ? "cursor-pointer shadow-slate-300/60 ring-1 ring-slate-900/5 hover:shadow-slate-400/60" : "cursor-pointer shadow-slate-200/40"}`}
              >
                
                {/* Image Area */}
                <motion.div layoutId={`card-image-container-${project.id}`} className="relative h-[55%] w-full overflow-hidden bg-slate-100">
                  <motion.img 
                    layoutId={`card-image-${project.id}`}
                    src={project.image} 
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700"
                    style={{ scale: isActive ? 1.05 : 1 }}
                  />
                  {/* Subtle inner shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <motion.div layoutId={`card-category-${project.id}`} className="mb-2 flex items-center gap-2">
                      <project.icon className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {project.category}
                      </span>
                    </motion.div>
                    <motion.h3 layoutId={`card-title-${project.id}`} className="text-2xl font-bold leading-tight text-slate-900">
                      {project.title}
                    </motion.h3>
                  </div>
                  
                  {/* Animated CTA - Only visible on the active center card */}
                  <div className="flex items-center justify-between overflow-hidden pt-2">
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center gap-2 text-sm font-bold text-blue-600"
                        >
                          Explore Details <ArrowUpRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Glass overlay for inactive cards to make them look faded/unfocused */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                )}

              </motion.div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center gap-6">
          <button 
            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
            disabled={activeIndex === 0}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex gap-2">
            {projects.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-500 ${idx === activeIndex ? "w-8 bg-blue-500" : "w-2 bg-slate-300"}`}
              />
            ))}
          </div>

          <button 
            onClick={() => setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1))}
            disabled={activeIndex === projects.length - 1}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>

      {/* --- Modal / Full Screen Expanded View --- */}
      <AnimatePresence>
        {expandedId && expandedProject && (
          <>
            {/* Dark/Blurred Backdrop overlay for the modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedId(null)}
              className="fixed inset-0 z-40 bg-slate-100/60 backdrop-blur-xl"
            />

            {/* The seamlessly expanding card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none sm:p-8">
              <motion.div
                layoutId={`card-container-${expandedProject.id}`}
                className="pointer-events-auto relative flex h-full max-h-[800px] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-900/5 md:flex-row"
              >
                
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => setExpandedId(null)}
                  className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-100"
                >
                  <X className="h-6 w-6" />
                </motion.button>

                {/* Left Side: Massive Hero Image */}
                <motion.div layoutId={`card-image-container-${expandedProject.id}`} className="h-64 w-full shrink-0 md:h-full md:w-1/2">
                  <motion.img 
                    layoutId={`card-image-${expandedProject.id}`}
                    src={expandedProject.image} 
                    alt={expandedProject.title}
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                {/* Right Side: Typography and Details */}
                <div className="flex w-full flex-col justify-center overflow-y-auto p-8 md:w-1/2 md:p-16">
                  <motion.div layoutId={`card-category-${expandedProject.id}`} className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                      <expandedProject.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
                      {expandedProject.category}
                    </span>
                  </motion.div>
                  
                  <motion.h3 layoutId={`card-title-${expandedProject.id}`} className="mb-8 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                    {expandedProject.title}
                  </motion.h3>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="mb-10 text-lg leading-relaxed text-slate-600">
                      {expandedProject.description}
                    </p>
                    
                    {/* Simulated "Extra Details" that fade in only in the expanded view */}
                    <div className="mb-12 grid grid-cols-2 gap-6 border-y border-slate-100 py-8">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Client</h4>
                        <p className="mt-2 font-semibold text-slate-900">Indux Enterprise</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Timeline</h4>
                        <p className="mt-2 font-semibold text-slate-900">6 Months</p>
                      </div>
                    </div>

                    <button className="group/btn flex h-14 w-max items-center gap-4 rounded-full bg-slate-900 px-8 font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-105 hover:bg-slate-800">
                      View Live Project
                      <ArrowUpRight className="h-5 w-5 transition-transform group-hover/btn:rotate-45 group-hover/btn:scale-110" />
                    </button>
                  </motion.div>

                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}