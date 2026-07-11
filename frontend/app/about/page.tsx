"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Sparkles, Play, Briefcase, Target, ShieldCheck, Asterisk, Trophy, KeyRound, Leaf } from "lucide-react";

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
    <div className="min-h-screen bg-white text-slate-800 font-sans overflow-hidden">
      
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
            {[1, 2, 3, 4].map((item, index) => (
              <motion.div 
                key={item} 
                variants={fadeUp}
                className={`relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
              >
                {/* Placeholders for images */}
                <div className="absolute inset-0 bg-slate-200">
                  <Image 
                    src={`https://images.unsplash.com/photo-${1515187029135 + index}?auto=format&fit=crop&w=600&q=80`} 
                    alt={`Team member ${item}`}
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
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
              Indux Group Journey
            </h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 md:gap-16 text-xl text-slate-600 leading-relaxed text-left"
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
      <section className="px-6 py-16 bg-slate-100">
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
            <div className="absolute -bottom-8 -right-4 md:-right-12 bg-white p-6 md:p-8 rounded-3xl shadow-xl max-w-[280px]">
              <p className="font-bold text-lg text-slate-900 leading-tight">
                "Making an impact, together"
              </p>
              <p className="text-slate-500 mt-2 font-medium">— Indux Founder</p>
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
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900 mb-6">
              We empower small business owners
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              We believe in the power of technology to transform ideas into reality. Our dedication to our clients goes beyond code; it's about building lasting partnerships that drive real-world impact.
            </p>
            <div className="pl-6 border-l-4 border-blue-600 py-2">
              <p className="text-xl font-medium italic text-slate-800">
                "Move different if you want different. Old keys can't Unlock new Door."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="relative px-6 py-24 md:py-32">
        {/* Floating Shapes */}
        <div className="absolute top-20 right-1/4 text-blue-200">
          <KeyRound size={32} />
        </div>
        <div className="absolute bottom-20 left-1/4 text-slate-200">
          <Leaf size={40} />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-16"
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
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Briefcase size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Professional Team</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                Our experts bring years of industry experience to deliver solutions that are both innovative and reliable.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div variants={fadeUp} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Target size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Target Oriented</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                We focus on your specific business goals, ensuring every line of code contributes to your success.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div variants={fadeUp} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Success Guarantee</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                We stand by our work with a commitment to quality, security, and long-term support for our partners.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
