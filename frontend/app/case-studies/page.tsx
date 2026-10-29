"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Briefcase,
  Search,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Sparkles,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getCaseStudies, CaseStudy } from "@/lib/api";

const initialFallbackCaseStudies: CaseStudy[] = [
  {
    _id: "seed-jemsoft",
    name: "Jemsoft (insurance)",
    slug: "jemsoft-insurance",
    headline: "Helping insurance agents manage policies and renewals in one system",
    challenge:
      "Agents tracked client policies and renewal dates manually across multiple carriers, which led to missed renewals, delayed customer communications, and lost trail commissions.",
    solution:
      "An insurance ERP with client records, policy tracking, automated premium reminders via WhatsApp, and automated commission reconciliation.",
    result:
      "+25% increase in annual policy retention and 15 hours per week saved on administrative follow-ups.",
    image: "/jemsoft.webp",
    status: "Published",
    views: 124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getCaseStudies()
      .then((data) => {
        if (data && data.length > 0) {
          setCaseStudies(data);
        } else {
          setCaseStudies(initialFallbackCaseStudies);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch case studies, showing fallback:", err);
        setCaseStudies(initialFallbackCaseStudies);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCaseStudies = useMemo(() => {
    if (!searchQuery.trim()) return caseStudies;
    const q = searchQuery.toLowerCase();
    return caseStudies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.challenge.toLowerCase().includes(q) ||
        c.solution.toLowerCase().includes(q) ||
        c.result.toLowerCase().includes(q)
    );
  }, [caseStudies, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <script
        type="application/ld+json"
        id="case-studies-breadcrumb-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://induxtechnology.com/",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Case Studies",
                "item": "https://induxtechnology.com/case-studies",
              },
            ],
          }),
        }}
      />

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-24">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-4 text-left max-w-xl"
              >
                <div className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Verified Outcomes
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Case Studies &<br />
                  <span className="italic text-slate-600 dark:text-slate-400 font-serif">
                    Client Results.
                  </span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  Explore how we partner with small businesses, manufacturers, and professional agencies to replace manual bottlenecks with custom CRM, ERP, and automation platforms.
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative max-w-md w-full lg:ml-auto"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search case studies by name, challenge, or result..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-md dark:shadow-none"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== CASE STUDIES GRID ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-4 animate-pulse"
                >
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredCaseStudies.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Briefcase className="size-12 mx-auto text-slate-400 mb-3 opacity-50" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No case studies found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Try searching for a different keyword or view all stories.
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="mt-4 cursor-pointer"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {filteredCaseStudies.map((study, idx) => {
                const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
                const displayImage = study.image
                  ? study.image.startsWith("http") || study.image.startsWith("/")
                    ? study.image
                    : `${apiBase}${study.image}`
                  : null;

                return (
                  <motion.div
                    key={study._id || idx}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 overflow-hidden group text-left"
                  >
                    <div>
                      {/* Optional Image Header */}
                      {displayImage && (
                        <div className="relative w-full aspect-[16/9] bg-slate-100 dark:bg-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                          <Image
                            src={displayImage}
                            alt={study.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}

                      <div className="p-7 sm:p-9 space-y-6">
                        {/* Header: Name & Badge */}
                        <div className="flex items-center justify-between gap-3">
                          <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                            {study.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            Case #{idx + 1}
                          </span>
                        </div>

                        {/* Headline */}
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {study.headline}
                        </h2>

                        {/* Structured Sections: Challenge, Built, Result */}
                        <div className="space-y-4 pt-2">
                          {/* The Challenge */}
                          <div className="rounded-2xl p-4 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                              <AlertCircle className="size-4 shrink-0" />
                              The Challenge
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {study.challenge}
                            </p>
                          </div>

                          {/* What We Built */}
                          <div className="rounded-2xl p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                              <Cpu className="size-4 shrink-0" />
                              What We Built
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {study.solution}
                            </p>
                          </div>

                          {/* The Result */}
                          <div className="rounded-2xl p-4 bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                              <CheckCircle2 className="size-4 shrink-0" />
                              The Result
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                              {study.result}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer / CTA */}
                    <div className="p-7 sm:p-9 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                      <Link
                        href={`/case-studies/${study.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 group/link cursor-pointer"
                      >
                        Read Full Story
                        <ArrowRight className="size-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href="/contact-us"
                        className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
                      >
                        Discuss Similar Project →
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to modernize your operations?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Let us analyze your manual workflows and design a custom software solution with predictable milestones and guaranteed delivery.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact-us"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-500/20 inline-flex items-center justify-center transition cursor-pointer"
              >
                Book a Discovery Call
              </Link>
              <Link
                href="/services"
                className="border border-slate-700 text-slate-200 hover:bg-slate-800 px-8 py-4 rounded-full font-bold inline-flex items-center justify-center transition cursor-pointer"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

