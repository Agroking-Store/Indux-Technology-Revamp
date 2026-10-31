"use client";

import React from "react";
import { ContactForm } from "@/components/ContactForm";
import { motion, Variants } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" as const } 
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: "easeOut" as const } 
  },
};

export default function PremiumContact() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 lg:pt-12 lg:pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">
          
          {/* Left Column: Info & Map */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col w-full"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3.5 py-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide w-fit">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              <span>Let&apos;s Connect</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={fadeUp} className="mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Let&apos;s talk about <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                your project
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={fadeUp} className="mb-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Tell us what you want to build or fix. We will respond within one business day with questions or a suggested next step. Prefer to talk? Call or WhatsApp{" "}
              <a href="tel:+918421538753" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                +91 84215 38753
              </a>.
            </motion.p>

            {/* Call & Email Info Cards */}
            <motion.div variants={staggerContainer} className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.a
                variants={fadeUp}
                href="tel:+918421538753"
                className="group p-4 rounded-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-sm bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Call Us</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    +91 84215 38753
                  </div>
                </div>
              </motion.a>

              <motion.a
                variants={fadeUp}
                href="mailto:connect@induxtechnology.com"
                className="group p-4 rounded-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-sm bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Us</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    connect@induxtechnology.com
                  </div>
                </div>
              </motion.a>
            </motion.div>

            {/* Map Frame */}
            <motion.div variants={fadeUp} className="relative h-[240px] sm:h-[260px] w-full overflow-hidden rounded-sm bg-slate-200 dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <iframe
                src="https://maps.google.com/maps?q=Indux Technology&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full opacity-100"
              ></iframe>              
              <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-sm bg-white/95 dark:bg-slate-900/95 p-3 shadow-md backdrop-blur-md border border-slate-200/80 dark:border-slate-800">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <p className="text-xs sm:text-sm font-medium leading-snug text-slate-800 dark:text-slate-200">
                  S. No. 05, Geeta Paradise, Opp. Zensar, Kharadi, Pune, India
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Contact Form Card */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="w-full flex items-start"
          >
            <div className="w-full rounded-sm bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-9 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">The more detail you share (goals, team size, deadlines), the more useful our first reply will be.</p>
              </div>

              <ContactForm />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
