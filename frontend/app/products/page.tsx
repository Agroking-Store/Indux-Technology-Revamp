"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Activity,
  ArrowRight,
  Settings,
  Plus,
  Package,
} from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/products-data";

const colorMap: Record<string, any> = {
  blue: {
    bg: "bg-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    icon: "text-blue-500",
    buttonHover: "hover:bg-blue-700",
  },
  emerald: {
    bg: "bg-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: "text-emerald-500",
    buttonHover: "hover:bg-emerald-700",
  },
  cyan: {
    bg: "bg-cyan-600",
    bgLight: "bg-cyan-50 dark:bg-cyan-900/20",
    text: "text-cyan-600 dark:text-cyan-400",
    icon: "text-cyan-500",
    buttonHover: "hover:bg-cyan-700",
  },
  indigo: {
    bg: "bg-indigo-600",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-600 dark:text-indigo-400",
    icon: "text-indigo-500",
    buttonHover: "hover:bg-indigo-700",
  },
};

export default function ProductsZigzagShowcase() {
  const [visibleCount, setVisibleCount] = useState(4);
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 py-24 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-24 flex flex-col items-center text-center">
          <motion.div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5">
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Our Catalog
            </span>
          </motion.div>
          <motion.h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Our{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Innovative Products
            </span>
          </motion.h1>
          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Industry-leading solutions designed to solve complex business
            challenges.
          </p>
        </div>

        <motion.div layout className="flex flex-col gap-24 lg:gap-32">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              const theme = colorMap[project.themeColor];
              const Icon = project.icon;

              return (
                <div
                  key={project.id}
                  className={`flex flex-col items-center gap-12 lg:gap-16 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-1/2"
                  >
                    <div className="relative rounded-3xl bg-slate-100 dark:bg-slate-900 p-4 shadow-xl sm:p-6 lg:p-8">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-64 w-full object-cover rounded-2xl shadow-sm sm:h-80 lg:h-96"
                      />
                    </div>
                  </motion.div> */}

                  {/* Updated Image Side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-1/2"
                  >
                    <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-2 shadow-2xl transition-all duration-500 hover:shadow-blue-500/10">
                      {/* Inner decorative background for transparency/small images */}
                      <div className="absolute inset-0 opacity-20 dark:opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]" />

                      <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-950 shadow-inner">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          // Tip: If your images are screenshots with text, change "object-cover" to "object-contain"
                        />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div className="w-full rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-xl dark:shadow-none border border-transparent dark:border-slate-800 lg:w-1/2 lg:p-12">
                    <div
                      className={`mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 ${theme.bgLight}`}
                    >
                      <Icon className={`h-3 w-3 ${theme.icon}`} />
                      <span className={`text-xs font-bold ${theme.text}`}>
                        {project.category}
                      </span>
                    </div>

                    <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                      {project.title}
                    </h2>
                    <p className="mb-8 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    <div className="mb-10">
                      <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
                        <Settings className={theme.icon} size={18} /> Key
                        Features
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {project.features.slice(0, 4).map((f, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <CheckCircle2 className={theme.icon} size={14} />{" "}
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={`/products/${project.id}`}>
                      <button
                        className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-colors cursor-pointer ${theme.bg} ${theme.buttonHover}`}
                      >
                        Explore Details <ArrowRight size={16} />
                      </button>
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <div className="mt-24 flex justify-center">
            <button
              onClick={() => setVisibleCount((v) => v + 4)}
              className="flex items-center gap-3 rounded-full border-2 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-4 font-bold text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-all"
            >
              <Plus /> Display More Solutions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
