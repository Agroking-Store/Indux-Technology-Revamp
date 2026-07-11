"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Sparkles, Play, Briefcase, Target, ShieldCheck, Asterisk, Trophy, KeyRound, Leaf, Rocket, Eye, CheckCircle2, Globe as GlobeIcon } from "lucide-react";
import {Globe} from "@/components/ui/globe";

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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
      
      {/* Hero Section (Blue Background) */}
      <section className="relative pt-48 md:pt-56 pb-64 px-6 bg-blue-600">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-1/4 text-white/20 animate-pulse">
          <Trophy size={50} />
        </div>
        <div className="absolute top-32 right-1/4 text-white/20 animate-spin-slow">
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
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            About us
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Innovating the Future of Digital Growth. We help businesses harness the power of technology to achieve their goals.
          </motion.p>
        </motion.div>
      </section>

      {/* Overlapping Image Grid */}
      <section className="relative px-6 -mt-40 z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
            ].map((imgSrc, index) => (
              <motion.div 
                key={imgSrc} 
                variants={fadeUp}
                className={`relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
              >
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                  <Image 
                    src={imgSrc} 
                    alt={`Indux Team & Workspace ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Indux Group Stories (Centered Title, Two-Column Text) */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white">
              Indux Group Journey
            </h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 md:gap-16 text-xl text-slate-600 dark:text-slate-400 leading-relaxed text-left"
          >
            <motion.p variants={fadeUp}>
              Founded in 2021, Indux Technology began with a simple mission: to help businesses harness the power of technology to achieve their goals. What started as a small team of passionate developers has grown into a comprehensive IT solutions provider with expertise across multiple domains.
            </motion.p>
            <motion.p variants={fadeUp}>
              Over the years, we’ve partnered with hundreds of businesses, from startups to enterprises, helping them navigate the complex digital landscape and implement solutions that drive growth and efficiency. Today, we continue to evolve and innovate, staying at the forefront of technology trends to deliver cutting-edge solutions that address the ever-changing needs of modern businesses.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section (Overlapping Cards) */}
      <section className="px-6 py-16 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Image with floating card */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=800&q=80" 
                alt="Founder" 
                fill 
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors">
                  <Play fill="currentColor" size={32} className="ml-2" />
                </button>
              </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-4 md:-right-12 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-xl max-w-[280px]">
              <p className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                "Making an impact, together"
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">— Indux Founder</p>
            </div>
          </motion.div>

          {/* Right: Text and Quote */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:pl-12 pt-8 md:pt-0"
          >
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white mb-6">
              We empower small business owners
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              We believe in the power of technology to transform ideas into reality. Our dedication to our clients goes beyond code; it's about building lasting partnerships that drive real-world impact.
            </p>
            <div className="pl-6 border-l-4 border-blue-600 py-2">
              <p className="text-xl font-medium italic text-slate-800 dark:text-slate-300">
                "Move different if you want different. Old keys can't Unlock new Door."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-24 md:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Image Collage for Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[400px] md:h-[500px] w-full"
          >
            {/* Image 1 (Back/Top Left) */}
            <div className="absolute top-0 left-0 w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-white dark:border-slate-950">
              <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team Collaboration" fill className="object-cover" unoptimized />
            </div>
            {/* Image 2 (Front/Bottom Right) */}
            <div className="absolute bottom-0 right-0 w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-white dark:border-slate-950">
              <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" alt="Mission Execution" fill className="object-cover" unoptimized />
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
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl shadow-inner">
                  <Rocket size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-lg">
                To empower businesses globally by delivering scalable, innovative, and reliable technology solutions that drive digital transformation and sustainable growth.
              </p>
              <ul className="space-y-4">
                {['Client-Centric Agile Development', 'Future-Ready Tech Integrations', 'Uncompromising Quality & Security'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-medium text-lg">
                    <CheckCircle2 size={24} className="text-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="px-6 py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Vision Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col order-2 lg:order-1"
          >
            <motion.div variants={fadeUp} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-inner">
                  <Eye size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-lg">
                To become the globally recognized standard of excellence in the IT sector, pioneering digital solutions that shape the future of modern enterprises.
              </p>
              <ul className="space-y-4">
                {['Global Reach & Impact', 'Continuous Innovation Hub', 'Sustainable & Ethical Tech'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-medium text-lg">
                    <CheckCircle2 size={24} className="text-indigo-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Right: Image Collage for Vision */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[400px] md:h-[500px] w-full order-1 lg:order-2"
          >
            {/* Image 1 (Back/Top Right) */}
            <div className="absolute top-0 right-0 w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-slate-50 dark:border-slate-900">
              <Image src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80" alt="Innovation" fill className="object-cover" unoptimized />
            </div>
            {/* Image 2 (Front/Bottom Left) */}
            <div className="absolute bottom-0 left-0 w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-slate-50 dark:border-slate-900">
              <Image src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" alt="Global Reach" fill className="object-cover" unoptimized />
            </div>
            {/* Decorative dot pattern */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[radial-gradient(#6366f1_2px,transparent_2px)] [background-size:12px_12px] opacity-30 z-0"></div>
          </motion.div>

        </div>
      </section>

      {/* Value Props Section */}
      <section className="relative px-6 py-24 md:py-32">
        {/* Floating Shapes */}
        <div className="absolute top-20 right-1/4 text-blue-300 dark:text-blue-500/50 animate-bounce drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] z-0">
          <KeyRound size={40} />
        </div>
        <div className="absolute bottom-20 left-1/4 text-indigo-300 dark:text-indigo-500/50 animate-pulse drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] z-0">
          <Leaf size={48} />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-16"
          >
            We help businesses to grow <br className="hidden md:block" />
            faster and bigger
          </motion.h2>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12"
          >
            {/* Value 1 */}
            <motion.div variants={fadeUp} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Briefcase size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Professional Team</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Our experts bring years of industry experience to deliver solutions that are both innovative and reliable.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div variants={fadeUp} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Target size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Target Oriented</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                We focus on your specific business goals, ensuring every line of code contributes to your success.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div variants={fadeUp} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Success Guarantee</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                We stand by our work with a commitment to quality, security, and long-term support for our partners.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Global Reach Section */}
      <section className="px-6 py-24 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold text-sm mb-6 shadow-sm">
                <GlobeIcon size={16} />
                Global Presence
              </div>
              
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                Trusted by Businesses Across the Globe
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                Our digital solutions transcend borders. From dynamic startups in Silicon Valley to established enterprises in Asia, we build scalable, future-ready technology that connects the world and drives international growth.
              </p>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col border-l-4 border-blue-500 pl-4">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">12+</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Countries</span>
                </div>
                <div className="flex flex-col border-l-4 border-indigo-500 pl-4">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">24/7</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Support</span>
                </div>
                <div className="flex flex-col border-l-4 border-emerald-500 pl-4">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">99%</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Uptime</span>
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
            className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center rounded-full bg-blue-500/5 dark:bg-blue-500/10 shadow-[0_0_100px_rgba(59,130,246,0.1)]"
          >
            <div className="absolute inset-0 max-w-full max-h-full">
              <Globe />
            </div>
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none"></div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
