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
  RefreshCw,
  Briefcase
} from 'lucide-react';
import { 
  FaHtml5, 
  FaCss3Alt, 
  FaJs, 
  FaPython, 
  FaJava, 
  FaNodeJs,
  FaDatabase
} from 'react-icons/fa';
import { 
  TbBrandTypescript, 
  TbBrandPhp, 
  TbBrandGolang, 
  TbBrandRust, 
  TbBrandMongodb
} from 'react-icons/tb';
import { SiRedis } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Tech stack data
const techStack = [
  { name: 'HTML5', category: 'Frontend', desc: 'Semantic layout & structure', icon: FaHtml5, color: 'text-orange-600 bg-orange-600/10' },
  { name: 'CSS3', category: 'Frontend', desc: 'Sleek layouts & styling', icon: FaCss3Alt, color: 'text-blue-500 bg-blue-500/10' },
  { name: 'JavaScript', category: 'Languages', desc: 'Client logic & interactions', icon: FaJs, color: 'text-yellow-550 bg-yellow-550/10' },
  { name: 'TypeScript', category: 'Languages', desc: 'Type-safe JS architecture', icon: TbBrandTypescript, color: 'text-blue-600 bg-blue-600/10' },
  { name: 'Python', category: 'Languages', desc: 'Back-end & AI computing', icon: FaPython, color: 'text-emerald-600 bg-emerald-600/10' },
  { name: 'PHP', category: 'Languages', desc: 'Server scripting & CMS bases', icon: TbBrandPhp, color: 'text-indigo-500 bg-indigo-500/10' },
  { name: 'Java', category: 'Languages', desc: 'Robust enterprise processes', icon: FaJava, color: 'text-rose-500 bg-rose-500/10' },
  { name: 'Go', category: 'Languages', desc: 'Performant concurrency routines', icon: TbBrandGolang, color: 'text-cyan-500 bg-cyan-500/10' },
  { name: 'Rust', category: 'Languages', desc: 'Memory-safe backend threads', icon: TbBrandRust, color: 'text-orange-700 bg-orange-700/10' },
  { name: 'Node.js', category: 'Backend', desc: 'Javascript server runtimes', icon: FaNodeJs, color: 'text-green-600 bg-green-600/10' },
  { name: 'PostgreSQL', category: 'Databases', desc: 'Structured SQL relational data', icon: FaDatabase, color: 'text-blue-600 bg-blue-600/10' },
  { name: 'MySQL', category: 'Databases', desc: 'Fast, secure SQL servers', icon: FaDatabase, color: 'text-sky-600 bg-sky-600/10' },
  { name: 'MongoDB', category: 'Databases', desc: 'Scalable NoSQL document stores', icon: TbBrandMongodb, color: 'text-emerald-500 bg-emerald-500/10' },
  { name: 'Redis', category: 'Databases', desc: 'High-speed session memory', icon: SiRedis, color: 'text-rose-600 bg-rose-600/10' },
];

// Expanded 12 capabilities requested by the user
const capabilities = [
  {
    title: 'Custom Web Applications',
    desc: 'Bespoke web applications built from scratch, tailored to support your specific business operations, user flows, and integrations.',
    icon: Code,
  },
  {
    title: 'Enterprise SaaS Development',
    desc: 'High-availability multi-tenant cloud software designed with robust subscription logic, user tenancy, and enterprise-grade scale.',
    icon: Layers,
  },
  {
    title: 'E-Commerce Solutions',
    desc: 'Robust e-commerce platforms featuring smooth checkout funnels, secure payment gateways, inventory sync, and client dashboards.',
    icon: Smartphone,
  },
  {
    title: 'Website Revamping',
    desc: 'Transforming and modernizing legacy websites with contemporary layouts, performance optimization, and current technology standards.',
    icon: RefreshCw,
  },
  {
    title: 'Portfolio Development',
    desc: 'Designing stunning, high-converting digital resumes and interactive creative showcases that spotlight your credentials and work.',
    icon: Briefcase,
  },
  {
    title: 'AI-Powered Applications',
    desc: 'Integrating Large Language Models (LLMs), custom machine learning endpoints, smart AI chat interfaces, and automated workflows.',
    icon: Cpu,
  },
  {
    title: 'CMS & Headless CMS Development',
    desc: 'Decoupled content hubs using Strapi, Sanity, or Contentful to deploy content across web and mobile layouts seamlessly.',
    icon: Workflow,
  },
  {
    title: 'Progressive Web Apps (PWAs)',
    desc: 'Optimizing web apps for mobile installations with native-like features, push notifications, offline reliability, and prompt cues.',
    icon: Globe,
  },
  {
    title: 'Cloud Deployment & DevOps',
    desc: 'Containerized clusters (Docker/Kubernetes) and automated CI/CD code testing pipelines deployed on AWS, Vercel, or GCP.',
    icon: Server,
  },
  {
    title: 'Website Performance & SEO Optimization',
    desc: 'Optimizing speeds for 98%+ Lighthouse grades, structured schema markup, sitemap index logs, and search visibility.',
    icon: Search,
  },
  {
    title: 'Third-Party Integrations',
    desc: 'Connecting external CRM systems, business ERP databases, payment flows, tracking portals, and third-party utilities.',
    icon: Activity,
  },
  {
    title: 'Maintenance & Support',
    desc: 'Continuous uptime monitoring, dependency upgrades, security patching, and live engineering debug assistance.',
    icon: ShieldCheck,
  },
];

const processSteps = [
  { step: '01', title: 'Discovery & Scope', desc: 'We research your user demands, list functional specifications, and design the technical blueprint.' },
  { step: '02', title: 'UX/UI Wireframing', desc: 'Creating premium, responsive prototypes to preview the layout, themes, and interactive animations.' },
  { step: '03', title: 'Agile Coding', desc: 'Writing clean, type-safe code using modern tech stacks, keeping components modular and performant.' },
  { step: '04', title: 'QC & Performance Tuning', desc: 'Comprehensive testing for cross-browser responsive layouts, SEO load speeds, and security vulnerabilities.' },
  { step: '05', title: 'Deployment & Scale', desc: 'Deploying to cloud infrastructures (AWS/Vercel) with active monitoring and continuous updates.' },
];

export default function WebDevServicePage() {
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
              
              {/* Left Column: Text & CTAs (Slides in from Left) */}
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
                  Web Development <br />
                  <span className="text-blue-600">Redefined.</span>
                </h1>
                <p className="text-lg text-slate-555 dark:text-slate-400 leading-relaxed mt-2 font-sans">
                  We engineer modern, secure, and lightning-fast web applications. Combining cutting-edge client-side rendering with bulletproof backend logic to drive engagement.
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

              {/* Right Column: Premium Floating Mock Browser Graphic */}
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
                      induxtech.com/web-dev
                    </div>
                  </div>
                  {/* Illustration Image */}
                  <img
                    src="/images/unsplash/img-09ddb758.webp"
                    alt="Web Application Mockup"
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
                  We cover everything from client interface styling to complex backend servers and automatic cloud orchestration. Explore our comprehensive services.
                </p>

                <Button 
                  nativeButton={false}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-bold tracking-wide text-sm uppercase transition-all shadow-lg shadow-blue-600/20 group cursor-pointer"
                  render={<Link href="/contact-us" />}
                >
                  Consult with our experts <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Right Column: Scrollable Cards (Identical styles to home page's feature blocks) */}
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

                      {/* Content Card (Strict Flat Border matching home page's features) */}
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
              We leverage the most robust, famous programming languages and database engines to compile speed, reliability, and security into every deployment.
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
            
            {/* Value columns (Slide in from Left) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-left space-y-6"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                Engineered for <br />
                Performance and Security.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                We do not use cookie-cutter templates. Every line of code is optimized for rendering speed, clean DOM nesting, search engine discoverability, and vulnerability isolation.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Zap className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Fast Load Times</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Server-rendered components and CDNs for rapid DOM paint.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Search className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">SEO Architecture</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Built-in sitemaps, structured schema data, and title indexing.</p>
                </div>
              </div>
            </motion.div>

            {/* Visual Box (Slide in from Right) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/5 bg-slate-900"
            >
              <Image
                src="/images/unsplash/img-325f90ce.webp"
                alt="Web Development Code"
                fill
                className="object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Quality Guarantee</span>
                <h3 className="text-xl font-bold mt-1">Lighthouse Score: 98%+</h3>
                <p className="text-slate-400 text-xs mt-1 font-sans">We guarantee excellent grades across Accessibility, Best Practices, and SEO.</p>
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
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to build your next web application?</h2>
              <p className="text-blue-100 text-base leading-relaxed font-sans">
                Connect with our engineering specialists. Tell us about your technical requirements, team structure, and delivery milestones.
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
