"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Settings,
  Plus,
  Package,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/products-data";
import { Button } from "@/components/ui/button";

export default function ProductsZigzagShowcase() {
  const [visibleCount, setVisibleCount] = useState(4);
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-grow pt-20 pb-20">
        {/* HERO SECTION - Matching Service Page Style */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide mb-6"
            >
              <Package className="size-4" /> Our Innovative Products
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
            >
              Built for <span className="text-blue-600">Performance.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400"
            >
              Industry-leading software solutions designed to streamline
              operations and drive exponential business growth.
            </motion.p>
          </div>
        </section>

        {/* ZIGZAG LIST */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 lg:space-y-40">
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${isEven ? "" : "lg:flex-row-reverse"}`}
                  >
                    {/* Image Column */}
                    <div className="w-full lg:w-1/2 relative">
                      <div className="absolute -inset-4 rounded-[2.5rem] bg-blue-600/5 dark:bg-blue-600/10 blur-2xl"></div>
                      <div className="relative rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xl group">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full aspect-[16/10] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-1/2 text-left">
                      <div className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-blue-600"></span>{" "}
                        {project.category}
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        {project.title}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
                        {project.shortDescription}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {project.features
                          .slice(0, 4)
                          .map((f: any, i: number) => {
                            const featureText =
                              typeof f === "object" ? f.title : f;

                            return (
                              <div
                                key={i}
                                className="flex items-center gap-3 text-slate-600 dark:text-slate-300"
                              >
                                <CheckCircle2 className="size-5 text-blue-600 shrink-0" />
                                <span className="text-sm font-medium">
                                  {featureText}
                                </span>
                              </div>
                            );
                          })}
                      </div>

                      <Link href={`/products/${project.slug}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 group cursor-pointer">
                          Explore Details{" "}
                          <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="mt-32 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((v) => v + 3)}
                className="rounded-full px-10 py-8 border-2 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-lg cursor-pointer"
              >
                <Plus className="mr-2" /> Display More Solutions
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
