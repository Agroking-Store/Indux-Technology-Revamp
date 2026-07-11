"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, Sprout, ShieldCheck, BarChart3, X } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Indux CRM",
    category: "CRM",
    description: "Engineered a scalable generative styling engine leveraging computer vision to recommend highly personalized outfits in real-time.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Bill Tea",
    category: "Enterprise",
    description: "Developed a deep learning diagnostic tool utilizing Convolutional Neural Networks (CNNs) to analyze crop health from anonymous uploads.",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "JEM Soft",
    category: "LIC",
    description: "Architected a secure symptom matrix system that communicates with remote servers utilizing advanced CKKS Homomorphic Encryption.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Sales Automation",
    category: "AI",
    description: "Built a complex raw material tracking and interactive statistics dashboard designed for high-stakes industrial operations.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Indux ERP",
    category: "ERP",
    description: "Built a complex raw material tracking and interactive statistics dashboard designed for high-stakes industrial operations.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "HRMS",
    category: "Human Resources",
    description: "Built a complex raw material tracking and interactive statistics dashboard designed for high-stakes industrial operations.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Indux Properties",
    category: "Real Estate",
    description: "Built a complex raw material tracking and interactive statistics dashboard designed for high-stakes industrial operations.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Card 360",
    category: "Casino",
    description: "Built a complex raw material tracking and interactive statistics dashboard designed for high-stakes industrial operations.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Dnyaypath",
    category: "Legal ERP",
    description: "Built a complex raw material tracking and interactive statistics dashboard designed for high-stakes industrial operations.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function SpatialGridShowcase() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Find the selected project object to pass data into the modal
  const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <div className="min-h-screen bg-slate-50 py-32 font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-20 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-2 shadow-sm"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Our Products
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl font-extrabold tracking-tighter text-slate-950 sm:text-6xl"
          >
            Ecosystem <span className="text-slate-400">of</span> Solutions.
          </motion.h2>
        </div>

        {/* The Base Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const Icon = project.icon;
            
            return (
              <motion.div
                key={project.id}
                layoutId={`card-container-${project.id}`}
                onClick={() => setSelectedId(project.id)}
                className="group relative flex h-[350px] cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 hover:shadow-xl hover:shadow-slate-200/50"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              >
                {/* Image Section */}
                <motion.div layoutId={`card-image-container-${project.id}`} className="h-1/2 w-full overflow-hidden">
                  <motion.img 
                    layoutId={`card-image-${project.id}`}
                    src={project.image} 
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <motion.div layoutId={`card-category-${project.id}`} className="mb-3 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {project.category}
                      </span>
                    </motion.div>
                    <motion.h3 layoutId={`card-title-${project.id}`} className="text-2xl font-bold text-slate-900">
                      {project.title}
                    </motion.h3>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500 transition-colors group-hover:text-blue-500">
                      View Details
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* --- Modal / Expanded View --- */}
      <AnimatePresence>
        {selectedId && selectedProject && (
          <>
            {/* Blurred Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-md"
            />

            {/* The Expanded Card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                layoutId={`card-container-${selectedProject.id}`}
                className="pointer-events-auto relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl md:flex-row"
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => setSelectedId(null)}
                  className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-sm backdrop-blur-md transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Expanded Image (Left Side on Desktop) */}
                <motion.div layoutId={`card-image-container-${selectedProject.id}`} className="h-64 w-full md:h-[500px] md:w-1/2">
                  <motion.img 
                    layoutId={`card-image-${selectedProject.id}`}
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                {/* Expanded Content (Right Side on Desktop) */}
                <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
                  <motion.div layoutId={`card-category-${selectedProject.id}`} className="mb-4 flex items-center gap-2">
                    <selectedProject.icon className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      {selectedProject.category}
                    </span>
                  </motion.div>
                  
                  <motion.h3 layoutId={`card-title-${selectedProject.id}`} className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    {selectedProject.title}
                  </motion.h3>

                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10 text-lg leading-relaxed text-slate-600"
                  >
                    {selectedProject.description}
                  </motion.p>

                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex h-14 w-max items-center gap-3 rounded-full bg-slate-900 px-8 font-bold text-white transition-transform hover:scale-105"
                  >
                    Explore System
                    <ArrowUpRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}