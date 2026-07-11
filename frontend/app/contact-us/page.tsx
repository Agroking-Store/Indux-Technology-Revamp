"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { Phone, Mail, Send, Building2, MapPin } from "lucide-react";
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
    <div className="min-h-screen bg-[#fafbfc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="mx-auto max-w-[90rem] px-6 py-20 lg:px-12 lg:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Let's Connect
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Let's build something <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                extraordinary.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mb-12 max-w-lg text-lg font-medium leading-relaxed text-slate-600">
              Whether you have a groundbreaking idea, need enterprise architecture, or just want to chat about the future of tech—we're ready when you are.
            </motion.p>
            <motion.div variants={staggerContainer} className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <motion.div variants={fadeUp} className="group flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition-colors group-hover:bg-blue-50 group-hover:ring-blue-100">
                  <Phone className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Call Us</h3>
                  <p className="mt-1 font-semibold text-slate-900">+91 84215 38753</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="group flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition-colors group-hover:bg-blue-50 group-hover:ring-blue-100">
                  <Mail className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Email Us</h3>
                  <p className="mt-1 font-semibold text-slate-900">connect@induxtechnology.com</p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div variants={fadeUp} className="relative h-[300px] w-full overflow-hidden rounded-[2rem] bg-slate-200 shadow-inner ring-1 ring-slate-900/5">
              <iframe
                src="https://maps.google.com/maps?q=Indux Technology&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale transition-all duration-700 hover:grayscale-0"
              ></iframe>              
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-start gap-3 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-700">
                  S. No 5, Geeta Paradise, opposite Zensar IT Park, Rakshak Nagar, Kharadi, Pune, Maharashtra 411014
                </p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-xl rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-900/5 sm:p-12">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900">Send a Message</h2>
                <p className="mt-2 text-slate-500">Fill out the form below and our team will get back to you within 24 hours.</p>
              </div>

              <form className="flex flex-col gap-6">                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-slate-500">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="John"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Doe"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      id="company"
                      placeholder="Indux Technology"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="john@example.com"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">Mobile No</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="+91 00000 00000"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Details *</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us about your requirements..."
                    className="resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    required
                  ></textarea>
                </div>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex h-14 w-full flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-8 font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-blue-600 sm:w-auto"
                  >
                    Send Message
                    <Send className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </motion.button>
                  <motion.button
                    type="reset"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex h-14 w-full items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 font-bold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
                  >
                    Clear
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}