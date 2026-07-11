"use client";

import Image from "next/image";
import { ArrowRight, Play, Trophy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {NumberTicker} from "@/components/ui/number-ticker";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-4 pb-24 lg:pt-8 lg:pb-32">
          {/* Subtle dot pattern background */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Left Side: Text Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-6 text-left max-w-xl"
              >
                <div className="inline-flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400 text-lg w-max ">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-800 -ml-1"></span>
                  </div>
                  Elevate your work with us
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Build Smarter.<br />
                  Scale Faster.
                </h1>
                
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mt-2 max-w-md">
                  Custom IT Solutions That Power Your Business.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:scale-105 cursor-pointer flex items-center gap-2">
                    Get Free Quote <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="link" className="font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 underline underline-offset-4 decoration-2 decoration-slate-300 dark:decoration-slate-700 hover:decoration-slate-800 dark:hover:decoration-slate-500 transition-all cursor-pointer">
                    Our Services
                  </Button>
                </div>
              </motion.div>

              {/* Right Side: Bento Image Grid (Custom Layout) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center"
              >
                
                {/* Floating Rotating Text Badge */}
                <div className="absolute left-0 lg:-left-6 bottom-1/4 z-20 w-32 h-32 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl dark:shadow-none dark:border dark:border-slate-800">
                  {/* Rotating Text SVG */}
                  <div className="absolute inset-2 animate-[spin_8s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 overflow-visible">
                      <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                      <text className="text-[11.5px] font-bold uppercase tracking-[0.2em]" fill="currentColor">
                        <textPath href="#circlePath" startOffset="0%">
                          • INDUX TECHNOLOGY • TOP RATED 
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  {/* Center Icon */}
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>

                {/* Floating Sparkles */}
                <div className="absolute right-0 bottom-10 z-20 text-blue-500 animate-pulse">
                  <Trophy className="w-12 h-12" fill="currentColor" />
                </div>

                <div className="grid grid-cols-12 grid-rows-12 gap-3 md:gap-4 w-full h-full relative z-10 p-4 md:p-8">
                  
                  {/* Left Tall Image */}
                  <div className="col-span-5 row-span-10 row-start-2 bg-slate-300 rounded-[2rem] rounded-tl-xl overflow-hidden relative shadow-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" 
                      alt="Team working" 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  
                  {/* Right Top Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-[2rem] rounded-tr-xl overflow-hidden relative shadow-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" 
                      alt="Discussion" 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  
                  {/* Right Middle Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-2xl overflow-hidden relative shadow-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop" 
                      alt="Meeting" 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>

                  {/* Right Bottom Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-[2rem] rounded-br-xl overflow-hidden relative shadow-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
                      alt="Collaboration" 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ABOUT US SECTION - NEW DESIGN */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              {/* Left Side: Overlapping Images */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative h-[500px] md:h-[600px] w-full"
              >
                {/* Back Image (Tall) */}
                <div className="absolute top-0 left-0 w-3/4 h-[85%] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-md">
                  <Image 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" 
                    alt="Team Discussion" 
                    fill 
                    className="object-cover" 
                  />
                </div>

                {/* Front Image (Square, bottom right) */}
                <div className="absolute bottom-0 right-0 w-[65%] h-[60%] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-950">
                  <Image 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" 
                    alt="IT Professional" 
                    fill 
                    className="object-cover" 
                  />
                </div>

                {/* Floating Badge (Top Right) */}
                <div className="absolute top-12 -right-4 md:-right-6 bg-blue-700 rounded-3xl rounded-tr-md text-white p-6 md:p-8 shadow-xl flex flex-col items-center justify-center min-w-[160px] transform hover:-translate-y-2 transition-transform duration-500">
                  <h3 className="text-4xl md:text-5xl font-black mb-1">
                    <NumberTicker value={10} className="text-white" />+
                  </h3>
                  <p className="text-xs font-bold tracking-widest uppercase text-blue-100 text-center leading-relaxed">
                    Years<br/>Of Experience
                  </p>
                </div>
              </motion.div>

              {/* Right Side: Text & Features */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2">
                  COMPANY ABOUT
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                  One of the fastest way to gain <span className="italic text-slate-600 dark:text-slate-400 font-serif">business success</span>
                </h2>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base mt-2 max-w-lg">
                  We empower businesses across all industries with cutting-edge IT solutions. From startups to large enterprises, our goal is to leverage the power of technology to help clients reach their target efficiently.
                </p>

                <div className="mt-2">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-sm md:text-base">Development Special Services:</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                    {[
                      "Emergency Solutions Anytime",
                      "How to improve business",
                      "Affordable price upto 2 years",
                      "Reliable & Experienced Team"
                    ].map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                        key={i} 
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={4} />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 rounded-full font-bold tracking-wider text-xs uppercase transition-all shadow-lg shadow-blue-700/20 group">
                    GET A QUOTE <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Solid Bottom Banner */}
          <div className="bg-[#0f2e4a] dark:bg-slate-900 w-full py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 md:divide-x divide-blue-800/40 dark:divide-slate-800"
              >
                {[
                  { num: 6.8, suffix: 'K+', label: 'Google reviews' },
                  { num: 200, suffix: '+', label: 'Complete project' },
                  { num: 70, suffix: '+', label: 'Team Members' },
                  { num: 350, suffix: '+', label: 'Happy customers' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:px-8 first:pl-0 last:pr-0">
                    <div className="w-14 h-14 rounded-full border-[1.5px] border-blue-400/20 flex items-center justify-center bg-blue-800/10">
                       <Trophy className="w-6 h-6 text-blue-300 opacity-80" strokeWidth={1.5} />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                        <NumberTicker value={stat.num} className="text-white" />{stat.suffix}
                      </h3>
                      <p className="text-blue-100/70 font-medium text-[11px] md:text-xs tracking-wider uppercase">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
