'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Share2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Building2,
  TrendingUp,
  Layers,
  FileCheck,
} from 'lucide-react';
import { CaseStudy, incrementCaseStudyView } from '@/lib/api';
import { Button } from '@/components/ui/button';

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Parses multiline input and renders each paragraph with proper spacing and newline preservation.
 */
function formatParagraphs(text?: string) {
  if (!text) return null;
  const normalized = text.replace(/\r\n/g, '\n');
  const paragraphs = normalized.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  if (paragraphs.length <= 1) {
    return <p className="whitespace-pre-line leading-relaxed">{normalized.trim()}</p>;
  }

  return (
    <div className="space-y-4">
      {paragraphs.map((p, idx) => (
        <p key={idx} className="whitespace-pre-line leading-relaxed">
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

const fallbackImages = [
  '/images/unsplash/img-0f36d5cf.webp',
  '/images/unsplash/img-3be447cf.webp',
  '/images/unsplash/img-8f08504f.webp',
];

interface CaseStudyDetailClientProps {
  caseStudy: CaseStudy;
  relatedStudies?: CaseStudy[];
}

export default function CaseStudyDetailClient({
  caseStudy,
  relatedStudies = [],
}: CaseStudyDetailClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!caseStudy?._id) return;
    const viewedKey = `viewed_casestudy_${caseStudy._id}`;
    if (!sessionStorage.getItem(viewedKey)) {
      incrementCaseStudyView(caseStudy._id).catch(console.error);
      sessionStorage.setItem(viewedKey, 'true');
    }
  }, [caseStudy?._id]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Case study link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const displayImage = caseStudy.image
    ? caseStudy.image.startsWith('http')
      ? caseStudy.image
      : caseStudy.image.startsWith('/uploads')
        ? `${apiBase}${caseStudy.image}`
        : caseStudy.image
    : fallbackImages[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ===== SOLOR THEME HERO HEADER (Identical to Blog Detail Page) ===== */}
      <div className="relative w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden border-b border-slate-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium mb-6">
            <button
              onClick={() => router.push('/')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => router.push('/case-studies')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Case Studies
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 line-clamp-1">{caseStudy.name}</span>
          </nav>

          {/* Client & Category Badge */}
          <span className="inline-flex items-center text-[10px] sm:text-xs uppercase tracking-widest font-extrabold bg-blue-500 text-white border border-blue-400/30 px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
            {caseStudy.name}
          </span>

          {/* Case Study Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight mb-8 max-w-4xl">
            {caseStudy.headline}
          </h1>

          {/* Meta Info Strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-400 border-t border-slate-900/60 pt-6">
            <span className="inline-flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-extrabold uppercase">
                <Award className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-slate-200">Verified Client Success</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400/80" />
              {formatDate(caseStudy.createdAt)}
            </span>
            {caseStudy.views !== undefined && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <span className="inline-flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400/80" />
                  {caseStudy.views} views
                </span>
              </>
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400/80" />
              3 min read
            </span>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT 12-COLUMN RESPONSIVE LAYOUT ===== */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
        {/* Back Link */}
        <button
          onClick={() => router.push('/case-studies')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Case Studies Feed
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ===== LEFT COLUMN: ARTICLE BODY (8 Columns) ===== */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 md:p-10 shadow-sm overflow-hidden flex flex-col gap-8 text-left"
            >
              {/* Featured Hero Image */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] max-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <img
                  src={displayImage}
                  alt={caseStudy.name}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </div>

              {/* Executive Highlight Intro (Styling like blog intro quote) */}
              <div className="border-l-4 border-blue-600 pl-5 text-left py-1">
                <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                  {caseStudy.headline}
                </p>
              </div>

              {/* Quick Summary Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Client System
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {caseStudy.name}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Deployment
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    Custom Web & ERP
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    Primary Metric
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {caseStudy.result.split(' ')[0]} Verified
                  </p>
                </div>
              </div>

              {/* Section 1: The Business Challenge */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50">
                    <AlertCircle className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    The Operational Challenge
                  </h2>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base pl-0 sm:pl-9">
                  {formatParagraphs(caseStudy.challenge)}
                </div>
              </div>

              {/* Section 2: What We Engineered */}
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50">
                    <Cpu className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    The Engineered Solution
                  </h2>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base pl-0 sm:pl-9">
                  {formatParagraphs(caseStudy.solution)}
                </div>
              </div>

              {/* Section 3: Verified Business Outcomes */}
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Quantified Business Impact
                  </h2>
                </div>

                {/* Elegant Outcome Highlight Box */}
                <div className="rounded-sm p-6 sm:p-7 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="w-full">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                        Measured ROI & Efficiency
                      </span>
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {formatParagraphs(caseStudy.result)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Share Bar */}
              <div className="pt-8 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Delivered by Indux Technology
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copied ? 'Link Copied!' : 'Share Case Study'}
                </button>
              </div>
            </motion.article>
          </div>

          {/* ===== RIGHT COLUMN: STICKY SIDEBAR (4 Columns) ===== */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
            {/* Widget 1: Project Specs Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm text-left flex flex-col gap-4"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
                Project Overview
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Client Solution
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {caseStudy.name}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Verified & Live
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Published
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {formatDate(caseStudy.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Impact Metric
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Confirmed ROI
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Widget 2: Ready to Build Something Similar? (Discovery CTA Card) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-sm p-6 text-white shadow-xl text-left flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-400/20">
                  Custom Engineering
                </span>
                <h3 className="text-lg font-bold text-white mt-3 leading-snug">
                  Facing a similar business hurdle?
                </h3>
                <p className="text-xs text-blue-100/80 leading-relaxed mt-2 font-normal">
                  We develop tailor-made CRM, ERP, and automation software designed to eliminate manual bottlenecks.
                </p>

                <div className="pt-4">
                  <Link href="/contact-us" className="w-full block">
                    <Button className="w-full h-12 px-7 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full text-sm sm:text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer group">
                      Schedule a Discovery Call
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Widget 3: More Success Stories (Matching Recent Articles widget) */}
            {relatedStudies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm text-left flex flex-col gap-4"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  More Case Studies
                </h3>
                <div className="flex flex-col gap-4">
                  {relatedStudies.map((item, i) => (
                    <div
                      key={item._id || i}
                      onClick={() => router.push(`/case-studies/${item.slug}`)}
                      className="flex gap-3 group cursor-pointer items-start"
                    >
                      <div className="w-10 h-10 rounded-sm bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="text-[9px] font-extrabold uppercase text-blue-500 tracking-wider">
                          {item.name}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                          {item.headline}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Widget 4: Quick Share Link */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm text-left flex flex-col gap-3"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
                Share This Case Study
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Know a team facing similar challenges? Share this case study with them.
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Copy Link
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
