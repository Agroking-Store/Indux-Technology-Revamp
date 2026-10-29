import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Cpu,
  CheckCircle2,
  Calendar,
  Eye,
  Share2,
  Briefcase,
} from "lucide-react";
import { getCaseStudyBySlug, getCaseStudies, CaseStudy } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const fallbackJemsoft: CaseStudy = {
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
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    let caseStudy: CaseStudy | null = null;
    try {
      caseStudy = await getCaseStudyBySlug(slug);
    } catch {
      if (slug === "jemsoft-insurance") caseStudy = fallbackJemsoft;
    }

    if (!caseStudy) {
      return { title: "Case Study Not Found" };
    }

    return {
      title: `${caseStudy.name} Case Study | Indux Technology`,
      description: caseStudy.headline,
      openGraph: {
        title: `${caseStudy.name}: ${caseStudy.headline}`,
        description: caseStudy.challenge,
        type: "article",
        images: caseStudy.image ? [caseStudy.image] : [],
      },
    };
  } catch {
    return { title: "Case Study | Indux Technology" };
  }
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let caseStudy: CaseStudy | null = null;
  let otherStudies: CaseStudy[] = [];

  try {
    caseStudy = await getCaseStudyBySlug(slug);
  } catch {
    if (slug === "jemsoft-insurance") {
      caseStudy = fallbackJemsoft;
    }
  }

  if (!caseStudy) {
    notFound();
  }

  try {
    const all = await getCaseStudies();
    otherStudies = all.filter((s) => s.slug !== slug).slice(0, 2);
  } catch {
    otherStudies = [];
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const displayImage = caseStudy.image
    ? caseStudy.image.startsWith("http") || caseStudy.image.startsWith("/")
      ? caseStudy.image
      : `${apiBase}${caseStudy.image}`
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 pb-20">
        {/* Navigation & Breadcrumbs */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to All Case Studies
          </Link>

          {/* Header */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                {caseStudy.name}
              </span>
              <span className="text-xs text-slate-400">Verified Case Study</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {caseStudy.headline}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-b border-slate-200 dark:border-slate-800 pb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {new Date(caseStudy.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {caseStudy.views !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Eye className="size-3.5" />
                  {caseStudy.views} views
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image (Optional) */}
        {displayImage && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-900">
              <Image
                src={displayImage}
                alt={caseStudy.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        )}

        {/* Core Case Study Content: 3 Pillar Breakdown */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          {/* Pillar 1: The Challenge */}
          <div className="rounded-3xl p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-100/70 dark:bg-rose-950/40">
                <AlertCircle className="size-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                The Challenge
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed pl-0 sm:pl-12">
              {caseStudy.challenge}
            </p>
          </div>

          {/* Pillar 2: What We Built */}
          <div className="rounded-3xl p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <div className="p-2.5 rounded-xl bg-indigo-100/70 dark:bg-indigo-950/40">
                <Cpu className="size-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                What We Built
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed pl-0 sm:pl-12">
              {caseStudy.solution}
            </p>
          </div>

          {/* Pillar 3: The Result */}
          <div className="rounded-3xl p-8 sm:p-10 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                <CheckCircle2 className="size-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                The Result
              </h2>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed pl-0 sm:pl-12">
              {caseStudy.result}
            </p>
          </div>

          {/* CTA Box */}
          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xl text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Facing a similar business challenge?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              We specialize in turning complex, manual operations into automated software systems with measurable return on investment.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact-us"
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-4 rounded-full inline-flex items-center justify-center transition shadow-lg"
              >
                Schedule a Free Discovery Session
              </Link>
            </div>
          </div>

          {/* Other Case Studies */}
          {otherStudies.length > 0 && (
            <div className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                More Success Stories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherStudies.map((s) => (
                  <Link
                    key={s._id}
                    href={`/case-studies/${s.slug}`}
                    className="group block p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition"
                  >
                    <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                      {s.name}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition">
                      {s.headline}
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {s.result}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

