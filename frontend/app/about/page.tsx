"use client"
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play, Briefcase, Target, ShieldCheck, Asterisk, Trophy, KeyRound, Leaf, Rocket, Eye, CheckCircle2, Globe as GlobeIcon, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";

// Clocks Component
const GlobalPresenceClocks = () => {
  const [indiaTime, setIndiaTime] = useState("");
  const [uaeTime, setUaeTime] = useState("");

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const india = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const uae = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }));

      const format = (date: Date) =>
        date.getHours().toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0");

      setIndiaTime(format(india));
      setUaeTime(format(uae));
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical Separator (Desktop Only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
        {/* India Section */}
        <div className="flex flex-col items-center text-center px-4 sm:px-8 py-4">
          <div className="text-5xl sm:text-7xl md:text-8xl text-slate-900 dark:text-white font-extrabold tracking-tight mb-4 min-h-[72px] sm:min-h-[96px]">
            {indiaTime || "00:00"}
          </div>

          <h3 className="text-2xl sm:text-3xl text-slate-900 dark:text-white font-bold mb-2 flex items-center justify-center">
            <img src="https://flagcdn.com/w40/in.png" alt="India Flag" className="w-8 h-auto mr-3 rounded-sm shadow-sm" />
            India
          </h3>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="font-medium uppercase tracking-widest text-xs sm:text-sm">Pune</span>
          </div>
          <div className="mt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">
            IST (UTC+5:30)
          </div>
        </div>

        {/* UAE Section */}
        <div className="flex flex-col items-center text-center px-4 sm:px-8 py-4">
          <div className="text-5xl sm:text-7xl md:text-8xl text-slate-900 dark:text-white font-extrabold tracking-tight mb-4 min-h-[72px] sm:min-h-[96px]">
            {uaeTime || "00:00"}
          </div>
          <h3 className="text-2xl sm:text-3xl text-slate-900 dark:text-white font-bold mb-2 flex items-center justify-center">
            <Image src="https://flagcdn.com/w40/ae.png" alt="UAE Flag" width={32} height={24} className="w-8 h-auto mr-3 rounded-sm shadow-sm" />
            UAE
          </h3>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="font-medium uppercase tracking-widest text-xs sm:text-sm">Dubai</span>
          </div>
          <div className="mt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">
            GST (UTC+4:00)
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AboutPage() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Indux Technology",
    "url": "https://induxtechnology.com",
    "logo": "https://induxtechnology.com/induxtechnologylogo_white.webp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kharadi, Pune",
      "addressRegion": "MH",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.linkedin.com/company/induxtechnology",
      "https://www.facebook.com/885831577953764/",
      "https://x.com/induxtechnology"
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
      <script
        type="application/ld+json"
        id="about-org-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Hero Section (Blue Background) */}
      <section className="relative pt-20 md:pt-24 pb-44 md:pb-48 px-6 bg-blue-600">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-1/4 text-white/20">
          <Trophy size={50} />
        </div>
        <div className="absolute top-32 right-1/4 text-white/20">
          <KeyRound size={58} />
        </div>
        <div className="absolute top-40 right-1/3 w-4 h-4 rounded-full border-2 border-white/20" />
        <div className="absolute top-24 left-1/3 w-3 h-3 rounded-full bg-white/20" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            A Pune software team that builds what your business needs
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto">
            Meet the Pune team behind Indux CRM, Jemsoft and InduxERP. We build practical software for growing businesses.
          </motion.p>
        </motion.div>
      </section>

 {/* Overlapping Image Grid */}
      <section className="relative px-6 -mt-32 md:-mt-36 z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              "/images/unsplash/img-419ff117.webp",
              "/images/unsplash/img-0f92163a.webp",
              "/images/unsplash/img-f5258efe.webp",
              "/images/unsplash/img-29d85ac4.webp"
            ].map((imgSrc, index) => (
              <motion.div
                key={imgSrc}
                variants={fadeUp}
 className={`relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl ${index % 2 !== 0 ? 'md:mt-6' : ''}`}
              >
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
 <Image
 src={imgSrc}
                    alt={`Indux Team & Workspace ${index + 1}`}
                    fill
 className="object-cover transition-transform duration-500"
                    unoptimized
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Indux Group Stories (Centered Title, Two-Column Text) */}
      <section className="px-6 py-12 md:py-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-8 md:mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900 dark:text-white">
              Indux Group Journey
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6 md:gap-12 text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-left"
          >
            <motion.p variants={fadeUp}>
              Indux Technology was founded in 2021 in Pune by Laxman Jadhav, a full-stack developer who saw how many growing businesses were held back by spreadsheets and disconnected tools.
            </motion.p>
            <motion.p variants={fadeUp}>
              Today our team of 25+ developers, designers and business analysts builds CRM, ERP, HRMS and custom applications for clients across manufacturing, insurance, services, retail, and real estate.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section (Overlapping Cards) */}
      <section className="px-6 py-12 md:py-16 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
 {/* Left: Image with floating card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
<div className="relative aspect-[3/4] md:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
              <img
                src="/owner.webp"
                alt="Founder"
                width="800"
                height="600"
                loading="lazy"
 className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-2 md:-right-8 bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-xl max-w-[260px] border border-slate-200/60 dark:border-slate-700/60">
              <p className="font-bold text-base md:text-lg text-slate-900 dark:text-white leading-tight">
                "Making an impact, together"
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium text-sm">— Laxman Jadhav</p>
            </div>
          </motion.div>

          {/* Right: Text and Quote */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:pl-8 pt-6 md:pt-0"
          >
            <h2 className="text-2xl md:text-4xl font-bold leading-tight text-slate-900 dark:text-white mb-4">
              We empower small business owners
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We believe in the power of technology to transform ideas into reality. Our dedication to our clients goes beyond code; it's about building lasting partnerships that drive real-world impact.
            </p>
            <div className="pl-5 border-l-4 border-blue-600 py-1.5">
              <p className="text-lg md:text-xl font-medium italic text-slate-800 dark:text-slate-300">
                "Move different if you want different. Old keys can't Unlock new Door."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-12 md:py-16 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">

 {/* Left: Image Collage for Mission */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[340px] md:h-[420px] w-full"
          >
 {/* Image 1 (Back/Top Left) */}
            <div className="absolute top-0 left-0 w-[65%] h-[72%] rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-white dark:border-slate-950">
 <Image src="/images/unsplash/img-9799f8ae.webp" alt="Team Collaboration at Indux Technology" fill className="object-cover" unoptimized />
            </div>
 {/* Image 2 (Front/Bottom Right) */}
            <div className="absolute bottom-0 right-0 w-[65%] h-[72%] rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-white dark:border-slate-950">
 <Image src="/images/unsplash/img-b27e33a3.webp" alt="Mission Execution at Indux Technology" fill className="object-cover" unoptimized />
            </div>
            {/* Decorative dot pattern */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:12px_12px] opacity-30 z-0"></div>
          </motion.div>

          {/* Right: Mission Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.div variants={fadeUp} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl shadow-inner">
                  <Rocket size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm md:text-base">
                Our mission is to empower businesses globally with scalable, innovative, and reliable technology solutions that simplify operations, improve productivity, and accelerate digital transformation. We help organizations turn ideas into practical digital solutions through custom software development, CRM and ERP systems, AI-powered automation, and web and mobile applications tailored to their unique business needs.
              </p>
              <ul className="space-y-2.5">
                {['Client-Centric Agile Development', 'Future-Ready Tech Integrations', 'Uncompromising Quality & Security'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base">
                    <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold text-sm md:text-base leading-relaxed">
                Simple. Reliable. Built around you. That’s how we work.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="px-6 py-12 md:py-16 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* Left: Vision Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col order-2 lg:order-1"
          >
            <motion.div variants={fadeUp} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-inner">
                  <Eye size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm md:text-base">
                To become a globally recognized IT leader by delivering innovative, scalable, and future-ready digital solutions. At Indux Technology, we aim to empower businesses through modern technology, AI-driven innovation, and reliable software solutions that enhance efficiency, encourage growth, and create lasting value.
              </p>
              <ul className="space-y-2.5">
                {['Global Reach & Impact', 'Continuous Innovation Hub', 'Sustainable & Ethical Tech'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base">
                    <CheckCircle2 size={20} className="text-indigo-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold text-sm md:text-base leading-relaxed">
                Build Once. Scale Infinitely.
              </p>
            </motion.div>
          </motion.div>

 {/* Right: Image Collage for Vision */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[340px] md:h-[420px] w-full order-1 lg:order-2"
          >
 {/* Image 1 (Back/Top Right) */}
            <div className="absolute top-0 right-0 w-[65%] h-[72%] rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-slate-50 dark:border-slate-900">
 <Image src="/images/unsplash/img-5b65630e.webp" alt="Innovation" fill className="object-cover" unoptimized />
            </div>
 {/* Image 2 (Front/Bottom Left) */}
            <div className="absolute bottom-0 left-0 w-[65%] h-[72%] rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-slate-50 dark:border-slate-900">
 <Image src="/images/unsplash/img-0ffac912.webp" alt="Global Reach" fill className="object-cover" unoptimized />
            </div>
            {/* Decorative dot pattern */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[radial-gradient(#6366f1_2px,transparent_2px)] [background-size:12px_12px] opacity-30 z-0"></div>
          </motion.div>

        </div>
      </section>

      {/* Our Approach & Values Section */}
      <section className="relative px-6  md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Our Approach */}
          <div className="text-center mb-10 md:mb-12">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3"
            >
              Our Approach
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              How we partner with you to turn business goals into working, reliable software.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mb-12 md:mb-14"
          >
            {[
              {
                title: "Understand the business first",
                desc: "We map your process before we write code, ensuring software matches how you work.",
                icon: Briefcase,
              },
              {
                title: "Build in small steps",
                desc: "You see progress every sprint and can change direction early with no surprises.",
                icon: Target,
              },
              {
                title: "Stay after launch",
                desc: "Training, support and improvements are part of our ongoing long-term relationship.",
                icon: ShieldCheck,
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-7 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Our Values */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-6 sm:p-8 md:p-10 text-center"
          >
            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-xs sm:text-sm">
              Our Values
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 mb-6">
              Honest estimates. Clear communication. Software that gets used.
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto text-left">
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Honest estimates</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Realistic timelines and transparent scope before we start.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Clear communication</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">One direct point of contact with weekly demos and updates.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Software that gets used</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Built around actual staff workflows, not theoretical checklists.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Global Reach Section */}
      <section className="px-6 py-16 md:py-20 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.div variants={fadeUp} className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold text-xs sm:text-sm mb-5 shadow-sm">
                <GlobeIcon size={14} />
                Global Presence
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-5">
                Trusted by Businesses Across the Globe
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 md:mb-10 leading-relaxed">
                Our digital solutions transcend borders. From dynamic startups in Silicon Valley to established enterprises in Asia, we build scalable, future-ready technology that connects the world and drives international growth.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col border-l-4 border-blue-500 pl-4">
                  <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">12+</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Countries</span>
                </div>
                <div className="flex flex-col border-l-4 border-indigo-500 pl-4">
                  <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">24/7</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Support</span>
                </div>
                <div className="flex flex-col border-l-4 border-emerald-500 pl-4">
                  <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">99%</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Uptime</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Globe Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[360px] md:h-[440px] w-full flex items-center justify-center rounded-full bg-blue-500/5 dark:bg-blue-500/10 shadow-[0_0_80px_rgba(59,130,246,0.1)]"
          >
            <div className="absolute inset-0 max-w-full max-h-full">
              <Globe />
            </div>
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none"></div>
          </motion.div>

        </div>
      </section>

      {/* Our Global Presence Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Our Global Presence
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Strategically located to serve our enterprise clients across the globe.
            </p>
          </div>
          <GlobalPresenceClocks />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-16 md:py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Want to talk about your project?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-8 max-w-xl">
            Let's discuss how we can build custom CRM, ERP, or web software around how your business works.
          </p>
          <Link href="/contact-us">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-full text-sm sm:text-base transition-all hover:scale-105 shadow-xl">
              Book a free consultation
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
