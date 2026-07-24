'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Database, 
  Cloud, 
  ShieldCheck, 
  Target, 
  Zap, 
  Server, 
  MessageSquare, 
  Workflow, 
  ArrowRight,
  Activity,
  Sparkles,
  Briefcase,
  Layers,
  Box
} from 'lucide-react';
import { 
  FaPython, 
  FaJava, 
  FaNodeJs,
  FaDatabase,
  FaAws
} from 'react-icons/fa';
import { 
  TbBrandTypescript, 
  TbBrandMongodb
} from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Tech stack data
const techStack = [
  { name: 'Java', category: 'Languages', desc: 'Robust enterprise processes', icon: FaJava, color: 'text-rose-500 bg-rose-500/10' },
  { name: 'Python', category: 'Languages', desc: 'Data processing & AI', icon: FaPython, color: 'text-emerald-600 bg-emerald-600/10' },
  { name: 'TypeScript', category: 'Languages', desc: 'Type-safe architecture', icon: TbBrandTypescript, color: 'text-blue-600 bg-blue-600/10' },
  { name: 'Node.js', category: 'Backend', desc: 'High-performance runtimes', icon: FaNodeJs, color: 'text-green-600 bg-green-600/10' },
  { name: 'PostgreSQL', category: 'Databases', desc: 'Structured relational data', icon: FaDatabase, color: 'text-blue-600 bg-blue-600/10' },
  { name: 'MongoDB', category: 'Databases', desc: 'Scalable NoSQL stores', icon: TbBrandMongodb, color: 'text-emerald-500 bg-emerald-500/10' },
  { name: 'AWS', category: 'Infrastructure', desc: 'Cloud hosting & scaling', icon: FaAws, color: 'text-orange-500 bg-orange-500/10' },
  { name: 'Cloud Native', category: 'Infrastructure', desc: 'Distributed architectures', icon: Cloud, color: 'text-cyan-500 bg-cyan-500/10' },
];

// 12 capabilities for ERP
const capabilities = [
  {
    title: 'Custom ERP Development',
    desc: 'Bespoke Enterprise Resource Planning software engineered to match your exact business models, supply chains, and financial workflows.',
    icon: Settings,
  },
  {
    title: 'System Integration',
    desc: 'Seamlessly integrating disparate legacy systems into a unified ERP environment to ensure real-time data flow across all departments.',
    icon: Layers,
  },
  {
    title: 'Financial Management',
    desc: 'Robust modules for accounting, invoicing, payroll, and expense tracking with built-in compliance and audit trails.',
    icon: BarChart3,
  },
  {
    title: 'Supply Chain Automation',
    desc: 'End-to-end visibility and automation for procurement, logistics, order fulfillment, and vendor management.',
    icon: Workflow,
  },
  {
    title: 'Human Resources (HRMS)',
    desc: 'Comprehensive employee lifecycle management, including recruitment, onboarding, performance tracking, and benefits administration.',
    icon: Users,
  },
  {
    title: 'Inventory & Warehouse',
    desc: 'Real-time stock tracking, predictive restocking alerts, barcode scanning, and multi-location warehouse management.',
    icon: Box,
  },
  {
    title: 'Manufacturing Execution (MES)',
    desc: 'Optimizing production lines with real-time equipment monitoring, quality control, and shop-floor scheduling.',
    icon: Zap,
  },
  {
    title: 'Data Migration & ETL',
    desc: 'Securely extracting, transforming, and loading historical data from decentralized databases into your new central ERP.',
    icon: Database,
  },
  {
    title: 'Business Intelligence (BI)',
    desc: 'Advanced predictive analytics, interactive dashboards, and custom reporting to drive data-backed executive decisions.',
    icon: Activity,
  },
  {
    title: 'Third-Party API Integrations',
    desc: 'Connecting your ERP with external payment gateways, CRM systems, e-commerce platforms, and marketing tools.',
    icon: Server,
  },
  {
    title: 'Multi-tenant Architecture',
    desc: 'Designing highly scalable cloud ERPs capable of supporting multiple subsidiaries, branches, and regional compliance standards.',
    icon: Cloud,
  },
  {
    title: 'Maintenance & Compliance',
    desc: 'Ongoing support, continuous security patching, and regular updates to ensure adherence to global data privacy laws.',
    icon: ShieldCheck,
  },
];

const processSteps = [
  { step: '01', title: 'Requirements Engineering', desc: 'We conduct deep-dive workshops to map your current workflows and identify operational bottlenecks.' },
  { step: '02', title: 'Architecture Design', desc: 'Designing the data schemas, modular components, and infrastructure topology for the ERP ecosystem.' },
  { step: '03', title: 'Agile Development', desc: 'Iteratively building core modules (Finance, HR, Inventory) and demonstrating progress through regular sprints.' },
  { step: '04', title: 'Testing & Integration', desc: 'Rigorous automated testing, security audits, and API integrations with your existing toolchain.' },
  { step: '05', title: 'Training & Rollout', desc: 'Deploying the system in phases, migrating data, and providing extensive training to ensure high user adoption.' },
];

export default function ERPServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative font-sans">
      
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none"></div>
      <div className="absolute top-[50%] right-[-15%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none"></div>

      <main className="flex-grow">
        {/* ===== HERO SECTION ===== */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 font-sans">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column: Text & CTAs */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-4 text-left max-w-xl font-sans"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide w-fit">
                  <Sparkles className="size-4 text-blue-500 animate-spin" />
                  Service Overview
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] font-sans">
                  ERP Systems <br />
                  <span className="text-blue-600">Unified.</span>
                </h1>
                <p className="text-lg text-slate-555 dark:text-slate-400 leading-relaxed mt-2 font-sans">
                  We architect, integrate, and deploy robust Enterprise Resource Planning solutions that streamline operations, centralize data, and drive unprecedented business efficiency.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Button
                    nativeButton={false}
                    className="bg-blue-600 hover:bg-blue-750 text-white px-8 py-6 rounded-full text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-103 cursor-pointer"
                    render={<Link href="/contact-us" />}
                  >
                    Start Your Project
                  </Button>
                  <Button
                    nativeButton={false}
                    variant="ghost"
                    className="px-8 py-6 rounded-full text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-900 cursor-pointer"
                    render={<a href="#capabilities" />}
                  >
                    Explore Capabilities
                  </Button>
                </div>
              </motion.div>

              {/* Right Column: Premium Floating Graphic */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: -2, y: 30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative max-w-lg w-full lg:ml-auto"
              >
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl animate-pulse"></div>
                <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
                  {/* Mock Browser Header */}
                  <div className="bg-slate-950/80 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div className="w-40 h-4 rounded bg-slate-800/60 mx-auto text-[10px] text-slate-500 flex items-center justify-center font-mono select-none">
                      induxtech.com/erp
                    </div>
                  </div>
                  {/* Illustration Image */}
                  <img
                    src="/images/unsplash/img-0fc06b38.webp"
                    alt="ERP Dashboard Analytics"
                    className="w-full h-auto object-cover opacity-90 hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ===== CAPABILITIES SECTION ===== */}
        <section id="capabilities" className="relative overflow-visible border-t border-slate-200/60 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start relative">
              
              {/* Left Column: Sticky Title & Info */}
              <div className="w-full lg:w-5/12 lg:sticky lg:top-32 z-10 text-left">
                <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-6">
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500 animate-ping"></span>
                    <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Capabilities
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6 font-sans">
                  What we build <br className="hidden md:block" />
                  and deliver
                </h2>
                
                <p className="text-slate-555 dark:text-slate-400 leading-relaxed text-lg max-w-md mb-10 font-sans">
                  We engineer comprehensive ERP platforms that break down data silos, from financial automation and inventory control to predictive business intelligence.
                </p>

                <Button 
                  nativeButton={false}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-bold tracking-wide text-sm uppercase transition-all shadow-lg shadow-blue-600/20 group cursor-pointer"
                  render={<Link href="/contact-us" />}
                >
                  Consult with our experts <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Right Column: Scrollable Cards */}
              <div className="w-full lg:w-7/12 flex flex-col gap-8 lg:gap-12 lg:pb-32">
                {capabilities.map((cap, idx) => {
                  const Icon = cap.icon;
                  const numStr = String(idx + 1).padStart(2, '0');
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-6 lg:gap-10 items-start w-full group text-left"
                    >
                      {/* Huge Index Number */}
                      <div className="text-7xl md:text-8xl lg:text-[7rem] font-bold text-blue-800 dark:text-blue-500 leading-none tracking-tighter mt-4 w-24 sm:w-32 flex-shrink-0 select-none">
                        {numStr}
                      </div>

                      {/* Content Card */}
                      <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-8 md:p-10 border-[1.5px] border-slate-200 dark:border-slate-800 transition-all duration-500 flex-1 relative group-hover:border-blue-800/30 dark:group-hover:border-blue-500/30 shadow-sm hover:shadow-xl dark:hover:shadow-none">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 dark:bg-blue-900/40 flex items-center justify-center mb-6">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-blue-400" strokeWidth={2} />
                        </div>
                        <h4 className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 dark:text-white mb-3 md:mb-4 tracking-tight">
                          {cap.title}
                        </h4>
                        <p className="text-slate-555 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                          {cap.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ===== MODERN TECH STACK SECTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/60 dark:border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Our Tech Stack</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
              We leverage enterprise-grade programming ecosystems and cloud infrastructure to ensure your ERP is highly available, secure, and infinitely scalable.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {techStack.map((tech, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.05 }}
                key={idx}
                className="group flex flex-col justify-between p-5 rounded-2xl border border-slate-200/60 dark:border-slate-900 bg-white dark:bg-slate-900/30 hover:border-blue-500/20 hover:shadow-lg dark:hover:shadow-none transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2.5 ${tech.color}`}>
                    <tech.icon className="size-full" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {tech.category}
                  </span>
                </div>
                <div className="mt-6 text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">
                    {tech.name}
                  </h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs mt-1 leading-snug font-sans">
                    {tech.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== DEVELOPMENT PROCESS SECTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/60 dark:border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Our Process</h2>
            <p className="text-slate-555 dark:text-slate-455 text-sm md:text-base leading-relaxed font-sans">
              We employ a methodical, phased rollout approach to minimize business disruption and ensure seamless ERP integration.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Central Progress Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-600 via-indigo-500 to-slate-200 dark:to-slate-800 rounded-full hidden md:block"></div>

            <div className="space-y-12">
              {processSteps.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    key={idx}
                    className={cn(
                      "flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative w-full",
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Process Card */}
                    <div className="w-full md:w-[45%] bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-2xl dark:hover:shadow-none transition-all duration-300 relative overflow-hidden group">
                      
                      {/* Stylized background number */}
                      <span className="absolute right-6 top-6 text-7xl font-extrabold text-slate-100 dark:text-slate-800/40 select-none group-hover:scale-110 transition-transform duration-500">
                        {step.step}
                      </span>
                      
                      <div className="relative z-10 text-left space-y-3">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
                          Phase {step.step}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-slate-555 dark:text-slate-400 text-sm leading-relaxed font-sans">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* Central pulsing node marker */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 bg-blue-600 z-20 shadow-md hidden md:block">
                      <div className="w-full h-full rounded-full bg-blue-500 animate-ping opacity-60"></div>
                    </div>

                    {/* Spacer to balance flex layout */}
                    <div className="w-full md:w-[45%] hidden md:block"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== WHY INDUX SECTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/60 dark:border-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Value columns */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-left space-y-6"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                Engineered for <br />
                Performance and Scale.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                We build ERP ecosystems capable of managing millions of data points simultaneously, maintaining high-speed query performance and steadfast security.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Database className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Data Integrity</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Fault-tolerant databases ensuring zero data loss across transactions.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Enterprise Security</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Multi-layered network security and strict access protocols.</p>
                </div>
              </div>
            </motion.div>

            {/* Visual Box */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/5 bg-slate-900"
            >
              <Image
                src="/images/unsplash/img-354f8fd9.webp"
                alt="ERP Data Analytics"
                fill
                className="object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Quality Guarantee</span>
                <h3 className="text-xl font-bold mt-1">Reliability Assured</h3>
                <p className="text-slate-400 text-xs mt-1 font-sans">We guarantee scalable system performance regardless of user concurrency.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== BOTTOM CTA SECTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-[#0F172A] text-white rounded-[2rem] p-8 md:p-12 overflow-hidden border border-slate-850 shadow-2xl"
          >
            {/* High-tech Glowing Background Accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-[100px] pointer-events-none"></div>
            
            {/* Subtle Grid overlay */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left Column: Heading and description */}
              <div className="text-left lg:max-w-2xl space-y-4">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                  Ready to unify your business operations?
                </h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed font-sans">
                  Connect with our enterprise architects. Share your current operational challenges, and let us design a centralized solution that drives sustainable growth.
                </p>
              </div>

              {/* Right Column: Button & footnote */}
              <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto flex-shrink-0">
                <Button
                  nativeButton={false}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/35"
                  render={<Link href="/contact-us" />}
                >
                  Start Conversation <ArrowRight className="w-4 h-4" />
                </Button>
                <span className="text-xs text-slate-500 font-medium tracking-wide">
                  Response within 24 hours • No commitment required
                </span>
              </div>

            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
