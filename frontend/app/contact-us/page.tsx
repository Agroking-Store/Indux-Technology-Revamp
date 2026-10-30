"use client"
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
    <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 font-sans text-slate-900 dark:text-white selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">
      {/* Reduced top padding: pt-6 on mobile, lg:pt-10 on desktop */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 lg:pt-8 lg:pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">
          
          {/* Left Column: Info & Map */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Let's Connect
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={fadeUp} className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              Let&apos;s talk about <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                your project
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={fadeUp} className="mb-8 max-w-lg text-base sm:text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Tell us what you want to build or fix. We will respond within one business day with questions or a suggested next step. Prefer to talk? Call or WhatsApp{" "}
              <a href="tel:+918421538753" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                +91 84215 38753
              </a>.
            </motion.p>

            {/* Call & Email Info */}
            <motion.div variants={staggerContainer} className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <motion.div variants={fadeUp} className="group flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-800 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:ring-blue-100 dark:group-hover:ring-blue-800">
                  <Phone className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Call Us</h3>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">+91 84215 38753</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="group flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-800 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:ring-blue-100 dark:group-hover:ring-blue-800">
                  <Mail className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Us</h3>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">connect@induxtechnology.com</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Map Frame */}
            <motion.div variants={fadeUp} className="relative h-[260px] sm:h-[280px] w-full overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-900 shadow-inner ring-1 ring-slate-900/5 dark:ring-slate-800">
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
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-start gap-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg backdrop-blur-md ring-1 ring-slate-900/5 dark:ring-slate-800">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
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
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg lg:max-w-xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-9 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">The more detail you share (goals, team size, deadlines), the more useful our first reply will be.</p>
              </div>

              <ContactForm />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}