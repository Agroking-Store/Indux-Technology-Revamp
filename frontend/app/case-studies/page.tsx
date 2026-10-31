"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getCaseStudies, CaseStudy } from "@/lib/api";

const fallbackCaseStudies: CaseStudy[] = [
  {
    _id: "seed-jemsoft",
    name: "Jemsoft (Insurance)",
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

const fallbackImages = [
  "/images/unsplash/img-0f36d5cf.webp",
  "/images/unsplash/img-3be447cf.webp",
  "/images/unsplash/img-8f08504f.webp",
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
          setCaseStudies(fallbackCaseStudies);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch case studies, showing fallback:", err);
        setCaseStudies(fallbackCaseStudies);
      })
      .finally(() => setLoading(false));
  }, []);

  const publishedStudies = useMemo(
    () => caseStudies.filter((s) => s.status === "Published" || !s.status),
    [caseStudies]
  );

  const filteredStudies = useMemo(() => {
    if (!searchQuery.trim()) return publishedStudies;
    const q = searchQuery.toLowerCase();
    return publishedStudies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.challenge.toLowerCase().includes(q) ||
        c.solution.toLowerCase().includes(q) ||
        c.result.toLowerCase().includes(q)
    );
  }, [publishedStudies, searchQuery]);

  const [featured, ...rest] = filteredStudies;

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
        {/* ===== HERO SECTION (Matching Blogs Hero) ===== */}
        <section className="relative overflow-hidden pt-12 pb-8 lg:pt-16 lg:pb-12">
          {/* Subtle dot pattern background */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-4 text-left max-w-xl"
              >
                <div className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Client Success Stories
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Case Studies &<br />
                  <span className="italic text-slate-600 dark:text-slate-400 font-serif">
                    Client Results.
                  </span>
                </h1>
                <div className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mt-1 space-y-3">
                  <p>
                    Explore how we partner with small businesses, manufacturers, and growing agencies to eliminate operational bottlenecks with custom software.
                  </p>
                </div>
              </motion.div>

              {/* Interactive Search Bar */}
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
                  placeholder="Search case studies by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== CASE STUDIES CONTENT ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-slate-100 dark:bg-slate-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStudies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-sm border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                No matching case studies found
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Try searching for a different keyword or clear your filters.
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="mt-4 rounded-full cursor-pointer"
                >
                  Clear Search
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              {/* Featured Case Study (Highlighted side-by-side design, matching blogs) */}
              {featured && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Link
                    href={`/case-studies/${featured.slug}`}
                    className="group grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl dark:shadow-none transition-all duration-300 mb-12"
                  >
                    <div className="lg:col-span-7 overflow-hidden min-h-[320px] relative bg-slate-100 dark:bg-slate-850">
                      <Image
                        src={
                          featured.image
                            ? featured.image.startsWith("http")
                              ? featured.image
                              : featured.image.startsWith("/uploads")
                                ? `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${featured.image}`
                                : featured.image
                            : fallbackImages[0]
                        }
                        alt={featured.name}
                        fill
                        priority={true}
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center text-left">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex w-fit items-center text-[10px] uppercase tracking-wider font-extrabold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-200/50 dark:border-blue-800/40">
                          {featured.name}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-blue-500" />
                          Featured Story
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {featured.headline}
                      </h2>

                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {featured.challenge}
                      </p>

                      <div className="p-4 rounded-sm bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 mb-6">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Verified Outcome
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                          {featured.result}
                        </p>
                      </div>

                      <div className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                        Explore Full Case Study
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid of Other Case Studies (Matching standard blog cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {(!searchQuery ? rest : filteredStudies).map((study, idx) => {
                  const imageSrc = study.image
                    ? study.image.startsWith("http")
                      ? study.image
                      : study.image.startsWith("/uploads")
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${study.image}`
                        : study.image
                    : fallbackImages[(idx + 1) % fallbackImages.length];

                  return (
                    <motion.div
                      key={study._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                    >
                      <Link
                        href={`/case-studies/${study.slug}`}
                        className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-sm border border-slate-200/90 dark:border-slate-800 overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl dark:shadow-none transition-all duration-300 text-left"
                      >
                        {/* Image Header */}
                        <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                          <Image
                            src={imageSrc}
                            alt={study.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>

                        {/* Card Content */}
                        <div className="p-6 sm:p-7 flex flex-col flex-grow">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900/40">
                              {study.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatDate(study.createdAt)}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2 leading-snug">
                            {study.headline}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                            {study.challenge}
                          </p>

                          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 line-clamp-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              {study.result.split(" ")[0]} Impact
                            </span>

                            <span className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                              Read Story
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {/* ===== CONSULTATION CTA BANNER ===== */}
          <div className="mt-16 sm:mt-20 rounded-sm p-8 sm:p-12 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white shadow-2xl relative overflow-hidden border border-blue-900/30 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Tailored Software Development
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Have a similar challenge in your business?
              </h2>
              <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed">
                Whether you need a custom CRM, an integrated ERP, or automated WhatsApp notifications, our engineers build platforms that pay for themselves.
              </p>
              <div className="pt-2 flex justify-center">
                <Link href="/contact-us">
                  <Button className="h-12 px-7 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full text-sm sm:text-base shadow-xl shadow-blue-600/30 cursor-pointer group flex items-center justify-center">
                    Schedule a Discovery Session
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
