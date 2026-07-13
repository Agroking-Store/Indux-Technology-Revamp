'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, 
  Code, 
  Cpu, 
  Database, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Search, 
  Smartphone, 
  ArrowRight, 
  Terminal,
  Activity,
  Server,
  Workflow,
  Sparkles,
  Repeat,
  MailWarning,
  RefreshCw,
  FileSpreadsheet,
  Layers3,
  CalendarDays,
  FileSignature,
  Share2,
  Users,
  ChevronDown
} from 'lucide-react';
import { 
  SiNodedotjs, 
  SiPython, 
  SiZapier, 
  SiMake, 
  SiDocker, 
  SiRedis, 
  SiPostgresql 
} from 'react-icons/si';
import { FaSlack } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Tech Stack List using react-icons/si
const techStack = [
  { name: 'Node.js', category: 'Backend', desc: 'Event-driven scripting runtime', icon: SiNodedotjs, color: 'text-green-600 bg-green-600/10' },
  { name: 'Python', category: 'Languages', desc: 'Data wrangler & scripts base', icon: SiPython, color: 'text-emerald-600 bg-emerald-600/10' },
  { name: 'Zapier', category: 'Integrations', desc: 'No-code API connection maps', icon: SiZapier, color: 'text-orange-500 bg-orange-500/10' },
  { name: 'Make.com', category: 'Integrations', desc: 'Visual cloud pipeline maps', icon: SiMake, color: 'text-purple-600 bg-purple-600/10' },
  { name: 'Docker', category: 'DevOps', desc: 'Isolated script container loops', icon: SiDocker, color: 'text-sky-500 bg-sky-500/10' },
  { name: 'Redis', category: 'Caching', desc: 'Fast task queues & workers buffer', icon: SiRedis, color: 'text-rose-600 bg-rose-600/10' },
  { name: 'PostgreSQL', category: 'Databases', desc: 'Relational triggers & audit logs', icon: SiPostgresql, color: 'text-blue-600 bg-blue-600/10' },
  { name: 'Slack API', category: 'Alerts', desc: 'Real-time pipeline flag triggers', icon: FaSlack, color: 'text-pink-500 bg-pink-500/10' }
];

// Capabilities
const capabilities = [
  {
    title: 'Workflow Orchestration',
    desc: 'Connecting different SaaS platforms into automatic multi-step event runs, utilizing Zapier, Make, or custom API servers.',
    icon: Repeat,
  },
  {
    title: 'Robotic Process Automation',
    desc: 'Deploying background scrapers and input scripts that perform repetitive keyboard/screen actions on legacy programs.',
    icon: Server,
  },
  {
    title: 'Data Pipeline Automation',
    desc: 'Orchestrating automated extract-transform-load (ETL) routines that sync spreadsheet rows, CSV lists, and database nodes.',
    icon: Database,
  },
  {
    title: 'Email & Alert Triggers',
    desc: 'Creating automated rules that dispatch transactional client alerts, payment follow-ups, and Slack notifications.',
    icon: MailWarning,
  },
  {
    title: 'Inventory Sync Systems',
    desc: 'Automatically updating warehouse counts, prices, and stock allocations across multiple retail stores and ERP records.',
    icon: RefreshCw,
  },
  {
    title: 'CRM Lead Routing',
    desc: 'Ingesting incoming marketing contacts, applying priority scoring rules, and assigning them to agents automatically.',
    icon: Users,
  },
  {
    title: 'Automated Billing & Sync',
    desc: 'Matching bank ledger deposits with Stripe billing triggers and logging QuickBooks book entries automatically.',
    icon: FileSpreadsheet,
  },
  {
    title: 'Document PDF Rendering',
    desc: 'Deploying automated template systems that dynamically render personalized client quotes, PDFs, and invoices.',
    icon: FileSignature,
  },
  {
    title: 'API Integration Hubs',
    desc: 'Configuring central cloud routers to parse incoming webhooks, translate formats, and handle error code fallbacks.',
    icon: Layers3,
  },
  {
    title: 'Support Desk Workflows',
    desc: 'Setting up classification algorithms that scan incoming support tickets, auto-reply to simple queries, and flag emergencies.',
    icon: Workflow,
  },
  {
    title: 'Employee Account Provisioning',
    desc: 'Automating the contract signing, directory setup, calendar booking, and email setup steps for incoming employees.',
    icon: CalendarDays,
  },
  {
    title: 'Error Telemetry & Slack Flags',
    desc: 'Configuring Sentry trackers and Slack alerts to flag developers instantly if a background sync script encounters an error.',
    icon: ShieldCheck,
  },
];

const processSteps = [
  { step: '01', title: 'Process Mapping', desc: 'Documenting your manual daily routines, SaaS platforms, and locating pipeline bottlenecks.' },
  { step: '02', title: 'API Discovery & Scopes', desc: 'Validating endpoint accesses, checking webhooks availability, and mapping data shapes.' },
  { step: '03', title: 'Integration Coding', desc: 'Writing middleware logic, building cron routines, and scheduling task queues.' },
  { step: '04', title: 'Exception & Error Scopes', desc: 'Testing for missing fields, configuring auto-retries, and formatting slack flag alerts.' },
  { step: '05', title: 'Sync Launch & Telemetry', desc: 'Adding live background automation routines and monitoring event logs.' },
];

export default function BusinessAutomationServicePage() {
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
                  Automation <br />
                  <span className="text-blue-600">Redefined.</span>
                </h1>
                <p className="text-lg text-slate-555 dark:text-slate-400 leading-relaxed mt-2 font-sans">
                  We orchestrate automated software workflows that replace repetitive data handling. Connect your CRMs, ERP databases, inventory systems, and email chains.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Button
                    nativeButton={false}
                    className="bg-blue-600 hover:bg-blue-755 text-white px-8 py-6 rounded-full text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-103 cursor-pointer"
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

              {/* Right Column: Premium Automation mockup browser graphic */}
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
                    <div className="w-40 h-4 rounded bg-slate-800/60 mx-auto text-[10px] text-slate-555 flex items-center justify-center font-mono select-none">
                      induxtech.com/automation
                    </div>
                  </div>
                  {/* Illustration Image */}
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                    alt="Automation Workflow Mockup"
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
                  We deploy secure data synchronizers, robotic scraper actions, document PDF generators, and fail-safe error monitoring lines.
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
                      viewport={{ once: true, margin: "-100px" }}
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
            <p className="text-slate-555 dark:text-slate-455 text-sm md:text-base leading-relaxed font-sans">
              We compile integrations using reliable event runtimes, visual SaaS routers, and database queue layers.
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
            <p className="text-slate-550 dark:text-slate-455 text-sm md:text-base leading-relaxed font-sans">
              We employ an agile, milestone-driven framework that guarantees transparency and continuous delivery.
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
                Stability and Transparency.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                Every automation pipeline includes extensive validation logic, structured error fallback blocks, and auto-notification channels to guarantee zero data loss.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Zap className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Real-Time Sync</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Webhooks triggered events processed under 200ms.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Search className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Audit Trail Logs</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Database triggers that track every transaction state.</p>
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
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
                alt="Automated Robotics or script dashboards"
                fill
                className="object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Quality Guarantee</span>
                <h3 className="text-xl font-bold mt-1">99.9% Pipeline Uptime</h3>
                <p className="text-slate-400 text-xs mt-1 font-sans">We guarantee strict input validation, retry protocols, and Sentry tracking.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== BOTTOM CTA SECTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl"
          >
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl text-left space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to automate your operations?</h2>
              <p className="text-blue-100 text-base leading-relaxed font-sans">
                Connect with our automation integration specialists. Tell us about your software stack, manual workflows, and communication channels.
              </p>
              <div className="pt-2">
                <Button
                  nativeButton={false}
                  className="bg-white hover:bg-slate-100 text-blue-700 px-8 py-6 rounded-full font-bold shadow-lg text-base cursor-pointer hover:scale-103 transition-transform"
                  render={<Link href="/contact-us" />}
                >
                  Start Conversation <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
