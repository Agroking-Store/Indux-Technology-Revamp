"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { projects } from "@/lib/products-data";
import {
  ArrowRight,
  Settings,
  Cpu,
  CheckCircle2,
  HelpCircle,
  BarChart,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GetQuoteModal } from "@/components/GetQuoteModal";

export default function ProductDetailPage() {
  const { slug } = useParams();

  // Find product based on the URL slug
  const product = projects.find((p) => p.slug === slug);

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                <BarChart className="size-3" /> {product.category}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.1]">
                {product.title}
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                {product.shortDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <GetQuoteModal>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-bold shadow-xl shadow-blue-600/20">
                    Get Free Quote <ArrowRight className="ml-2 size-5" />
                  </Button>
                </GetQuoteModal>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-3xl group-hover:bg-blue-600/20 transition-all"></div>
              <img
                src={product.image}
                alt={product.title}
                className="relative rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl w-full object-cover aspect-[16/10]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {product.stats.map((stat, i) => (
              <div
                key={i}
                className="md:border-r last:border-0 border-blue-400/30"
              >
                <div className="text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-blue-100/70 text-sm font-bold uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        {/* 3. STICKY CONTENT SECTION */}
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* LEFT: Sticky Side */}
          <aside className="w-full lg:w-5/12 lg:sticky lg:top-32 space-y-12 text-left">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Designed for the <br />{" "}
                <span className="text-blue-600">Future of Business</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="text-blue-600 size-5" /> Built With Modern Tech
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.tech.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="text-blue-600 size-5" /> Security
                Standard
              </h4>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <CheckCircle2 className="size-4 text-emerald-500" /> AES-256 Bit
                Encryption
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <CheckCircle2 className="size-4 text-emerald-500" /> Daily
                Automated Backups
              </div>
            </div>
          </aside>

          {/* RIGHT: Feature Cards (Vertical Scroll) */}
          <div className="w-full lg:w-7/12 space-y-8">
            {product.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all text-left"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                    <Settings className="size-7" />
                  </div>
                  <span className="text-5xl font-black text-slate-100 dark:text-slate-800/50">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. FAQ SECTION */}
        <section className="mt-40 border-t border-slate-200 dark:border-slate-900 pt-24 text-left">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 flex items-center gap-3">
              <HelpCircle className="text-blue-600 size-10" /> FAQ
            </h2>
            <div className="space-y-6">
              {product.faq.map((item, i) => (
                <div
                  key={i}
                  className="p-8 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">
                    Q: {item.q}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400">
                    A: {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CTA */}
        <section className="mt-40 text-left">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-slate-800">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight max-w-3xl">
                Experience the power of <br />{" "}
                <span className="text-blue-500">{product.title}</span> today.
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto">
                <GetQuoteModal>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 rounded-full text-xl font-bold shadow-2xl transition-transform hover:scale-105 border-none">
                    Schedule a Demo
                  </Button>
                </GetQuoteModal>
                <Link href="/contact-us" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800 px-10 py-8 rounded-full text-xl font-bold"
                  >
                    Talk to Sales
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
