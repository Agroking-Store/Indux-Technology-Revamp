"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  Mail,
} from "lucide-react";
import { getDynamicRecentWorks, getFullImageUrl, formatLiveUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { GetQuoteModal } from "@/components/GetQuoteModal";

export default function OurRecentWorksPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    getDynamicRecentWorks()
      .then((data) => {
        if (isMounted) {
          setWorks(data || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setWorks([]);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute dynamic categories based on available works
  const categories = useMemo(() => {
    const cats = Array.from(new Set(works.map((w) => w.category).filter(Boolean)));
    return cats.length > 0 ? ["All", ...cats] : [];
  }, [works]);

  const filteredWorks =
    selectedCategory === "All"
      ? works
      : works.filter((work) => work.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Schema for SEO */}
      <script
        type="application/ld+json"
        id="recent-works-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Our Recent Works | Indux Technology",
              "description":
                "Explore recent software, e-commerce, web development, and digital solutions delivered by Indux Technology.",
              "url": "https://induxtechnology.com/our-recent-works",
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://induxtechnology.com/",
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Products",
                  "item": "https://induxtechnology.com/products",
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Our Recent Works",
                  "item": "https://induxtechnology.com/our-recent-works",
                },
              ],
            },
          ]),
        }}
      />

      <main className="flex-grow pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16 overflow-hidden">
          <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide mb-4"
            >
              <Sparkles className="size-4" /> Client Showcase & Portfolio
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-6"
            >
              Our Recent <span className="text-blue-600">Works.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 dark:text-slate-400"
            >
              A curated collection of bespoke web applications, e-commerce platforms,
              and enterprise digital ecosystems built with modern engineering and high performance.
            </motion.p>

            {/* Quick Metrics Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {[
                { label: "Successful Deployments", value: "50+" },
                { label: "Client Satisfaction", value: "99%" },
                { label: "Average Performance", value: "98/100" },
                { label: "Industries Served", value: "10+" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xs text-center"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Category Filter Tabs */}
            {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </motion.div>
            )}
          </div>
        </section>

        {/* WORKS LIST / SHOWCASE */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {!isLoading && works.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Works Published Yet</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
                Our recent work portfolio will appear here as soon as projects are published from the admin panel.
              </p>
            </div>
          ) : (
          <div className="space-y-20 lg:space-y-32">
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((work, index) => {
                const isEven = index % 2 === 0;
                const imageSrc = getFullImageUrl(work.image);
                const itemKey = work._id || work.id || work.slug;

                return (
                  <motion.div
                    key={itemKey}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${
                      isEven ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Visual Media Showcase */}
                    <div className="w-full lg:w-1/2 relative group">
                      <div className="absolute -inset-4 rounded-[2.5rem] bg-blue-600/5 dark:bg-blue-600/10 blur-2xl group-hover:bg-blue-600/10 dark:group-hover:bg-blue-600/20 transition-all duration-700"></div>

                      {/* Category Label strictly ABOVE the image frame - zero overlap */}
                      <div className="flex items-center justify-between mb-2.5 px-1 sm:px-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200/80 dark:border-blue-900/80 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {work.category}
                        </span>
                        <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
                          {work.client} • {work.year}
                        </span>
                      </div>
                      
                      <div
                        onClick={() => setActiveModalProject(work)}
                        className="relative rounded-[2rem] border border-slate-200/90 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/80 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer p-2 sm:p-3"
                      >
                        <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[380px] rounded-[1.5rem] overflow-hidden bg-white/60 dark:bg-slate-950 flex items-center justify-center">
                          <Image
                            src={imageSrc}
                            alt={work.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                            priority={index < 2}
                            unoptimized={imageSrc.startsWith("http")}
                          />
                        </div>



                        {/* Hover Overlay Preview Button */}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[2rem]">
                          <span className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            View Project Details <ArrowRight className="size-4" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-1/2 text-left">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                          <span className="w-6 h-[2px] bg-blue-600 dark:bg-blue-400"></span>
                          {work.client}
                        </span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-mono">
                          {work.year}
                        </span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                        {work.title}
                      </h2>

                      <p className="text-blue-600 dark:text-blue-400 text-sm sm:text-base font-semibold mb-4">
                        {work.tagline}
                      </p>

                      <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-6">
                        {work.shortDescription}
                      </p>

                      {/* Key Highlights */}
                      {work.highlights && work.highlights.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          {work.highlights.slice(0, 4).map((h: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <CheckCircle2 className="size-4.5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-snug">
                                {h}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Metrics Card Row */}
                      {work.metrics && work.metrics.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 mb-6">
                          <TrendingUp className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
                            Key Impact:
                          </span>
                          {work.metrics.map((m: any, mi: number) => (
                            <div
                              key={mi}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                            >
                              <span className="font-bold text-slate-900 dark:text-white">
                                {m.value}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400">
                                {m.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      {work.technologies && work.technologies.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-8">
                          {work.technologies.map((t: string, ti: number) => (
                            <span
                              key={ti}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          onClick={() => setActiveModalProject(work)}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-5 font-semibold text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                        >
                          View Details
                          <ChevronRight className="size-4 ml-1.5" />
                        </Button>
                        {formatLiveUrl(work.liveUrl) && (
                          <a
                            href={formatLiveUrl(work.liveUrl)!}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              className="rounded-xl px-5 py-5 font-semibold text-sm border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all cursor-pointer"
                            >
                              Live Project
                              <ExternalLink className="size-4 ml-1.5" />
                            </Button>
                          </a>
                        )}
                        <GetQuoteModal>
                          <Button
                            variant="outline"
                            className="rounded-xl px-6 py-5 font-semibold text-sm border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-pointer"
                          >
                            Build Similar Project
                          </Button>
                        </GetQuoteModal>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          )}
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28 mb-16 sm:mb-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-8 sm:p-14 lg:p-16 text-center text-white shadow-2xl border border-blue-500/20">
            {/* Ambient Background Accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] opacity-15 bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-400/25 mb-5 backdrop-blur-sm">
                <Sparkles className="size-3.5 text-blue-400" />
                Have a New Concept?
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
                Let&apos;s Build Your Next Digital{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                  Success Story.
                </span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                From fast-scaling e-commerce to enterprise platforms and AI automation,
                our engineering team is ready to turn your ideas into market-ready reality.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-xs sm:max-w-md mx-auto">
                <GetQuoteModal>
                  <Button className="w-full sm:w-56 h-12 sm:h-13 px-6 rounded-full font-semibold text-sm sm:text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2">
                    Request a Quote <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Button>
                </GetQuoteModal>
                <Link href="/contact-us" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-56 h-12 sm:h-13 px-6 rounded-full font-semibold text-sm sm:text-base bg-white/5 hover:bg-white/10 text-white border-white/20 hover:border-white/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    Contact Our Team <Mail className="size-4 shrink-0" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* PROJECT DETAILS POPUP MODAL */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    {activeModalProject.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Year: {activeModalProject.year}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Full-width Screenshot (Uncropped) */}
                <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950/[0.03] dark:bg-slate-950 shadow-lg flex items-center justify-center p-2">
                  <Image
                    src={getFullImageUrl(activeModalProject.image)}
                    alt={activeModalProject.title}
                    fill
                    className="object-contain rounded-xl"
                    unoptimized={getFullImageUrl(activeModalProject.image).startsWith("http")}
                  />
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {activeModalProject.title}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-base font-semibold mt-1">
                    {activeModalProject.tagline}
                  </p>
                </div>

                {/* Full Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Project Overview
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {activeModalProject.fullDescription}
                  </p>
                </div>

                {/* Key Features / Highlights */}
                {activeModalProject.highlights && activeModalProject.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Key Deliverables & Architecture
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeModalProject.highlights.map((h: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                        >
                          <CheckCircle2 className="size-4 text-blue-600 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {activeModalProject.metrics && activeModalProject.metrics.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Business Results
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {activeModalProject.metrics.map((m: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-center"
                        >
                          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                            {m.value}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                {activeModalProject.technologies && activeModalProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProject.technologies.map((t: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 sm:px-8 sm:py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setActiveModalProject(null)}
                  className="rounded-xl px-5 text-sm cursor-pointer"
                >
                  Close
                </Button>
                {formatLiveUrl(activeModalProject.liveUrl) && (
                  <a
                    href={formatLiveUrl(activeModalProject.liveUrl)!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="rounded-xl px-5 text-sm font-semibold border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all cursor-pointer"
                    >
                      Visit Live Project
                      <ExternalLink className="size-4 ml-1.5" />
                    </Button>
                  </a>
                )}
                <GetQuoteModal>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 text-sm font-semibold cursor-pointer">
                    Start Similar Project
                  </Button>
                </GetQuoteModal>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
