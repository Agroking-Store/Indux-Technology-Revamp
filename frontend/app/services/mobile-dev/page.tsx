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
  SmartphoneNfc,
  Tablet,
  AppWindow,
  Share2,
  BellRing,
  WifiOff,
  ChevronDown
} from 'lucide-react';
import { 
  SiSwift, 
  SiKotlin, 
  SiReact, 
  SiFlutter, 
  SiDart, 
  SiFirebase, 
  SiSqlite 
} from 'react-icons/si';
import { FaServer } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Tech Stack List
const techStack = [
  { name: 'Swift', category: 'iOS Native', desc: 'Apple SwiftUI ecosystem code', icon: SiSwift, color: 'text-orange-500 bg-orange-500/10' },
  { name: 'Kotlin', category: 'Android Native', desc: 'Android Jetpack Compose code', icon: SiKotlin, color: 'text-indigo-500 bg-indigo-500/10' },
  { name: 'React Native', category: 'Cross-Platform', desc: 'Universal JS/TS interfaces', icon: SiReact, color: 'text-blue-500 bg-blue-500/10' },
  { name: 'Flutter', category: 'Cross-Platform', desc: 'Native Dart-compiled engine', icon: SiFlutter, color: 'text-sky-500 bg-sky-500/10' },
  { name: 'Dart', category: 'Languages', desc: 'Flutter UI rendering base', icon: SiDart, color: 'text-cyan-500 bg-cyan-500/10' },
  { name: 'Firebase', category: 'Cloud Infrastructure', desc: 'Serverless authentication & sync', icon: SiFirebase, color: 'text-amber-500 bg-amber-500/10' },
  { name: 'SQLite', category: 'Databases', desc: 'Relational local SQL database', icon: SiSqlite, color: 'text-blue-600 bg-blue-600/10' },
  { name: 'Realm', category: 'Databases', desc: 'High-speed object database engine', icon: FaServer, color: 'text-purple-500 bg-purple-500/10' }
];

// Capabilities
const capabilities = [
  {
    title: 'iOS App Development',
    desc: 'Building high-performance native iOS applications tailored for iPhones and iPads, using Swift and modern SwiftUI frameworks.',
    icon: AppleIconWrapper,
  },
  {
    title: 'Android App Development',
    desc: 'Engineering native Android apps optimized across device profiles, utilizing Kotlin, Jetpack Compose, and material guidelines.',
    icon: Smartphone,
  },
  {
    title: 'React Native Apps',
    desc: 'Deploying robust cross-platform mobile apps using a unified TypeScript codebase, saving development time without losing responsiveness.',
    icon: AppWindow,
  },
  {
    title: 'Flutter Development',
    desc: 'Crafting visually stunning, compiled native apps for iOS and Android utilizing Dart and Flutter\'s pixel-perfect rendering engine.',
    icon: Globe,
  },
  {
    title: 'Mobile UI/UX Design',
    desc: 'Designing thumb-friendly layouts, intuitive swipe gestures, transitions, dark modes, and modern responsive screen grids.',
    icon: Sparkles,
  },
  {
    title: 'App Store Optimization & Release',
    desc: 'Handling deployment setups, App Store Connect submissions, Google Play Console updates, reviews, and release notes management.',
    icon: Share2,
  },
  {
    title: 'Push Notifications & Alerts',
    desc: 'Integrating targeted notifications using Firebase Cloud Messaging (FCM) or OneSignal to drive daily active user retention.',
    icon: BellRing,
  },
  {
    title: 'Offline-First Storage',
    desc: 'Enabling apps to load data offline by configuring local relational caches with automated cloud synchronization rules.',
    icon: WifiOff,
  },
  {
    title: 'API & Backend Integration',
    desc: 'Linking native frontends with secure REST and GraphQL backend services using encrypted headers and JSON parsing.',
    icon: Database,
  },
  {
    title: 'Device Hardware Integration',
    desc: 'Accessing physical device hardware securely, including Camera streams, GPS location tracking, Bluetooth connections, and Biometrics.',
    icon: SmartphoneNfc,
  },
  {
    title: 'App Security & Encryption',
    desc: 'Protecting data using iOS Keychain storage, Android Keystore provider, SSL pinning, and code obfuscation tools.',
    icon: ShieldCheck,
  },
  {
    title: 'Telemetry & Crash Monitoring',
    desc: 'Configuring Firebase Crashlytics and Sentry logs to locate and resolve runtime issues before they impact customers.',
    icon: Activity,
  },
];

const processSteps = [
  { step: '01', title: 'Strategy & Wireframing', desc: 'Defining user journeys, screen maps, and functional scopes for iOS and Android platforms.' },
  { step: '02', title: 'Interactive Prototypes', desc: 'Crafting pixel-perfect interface animations and visual layouts to preview the UX flow.' },
  { step: '03', title: 'Agile Coding', desc: 'Writing native or cross-platform code, integrating database layers, and linking API modules.' },
  { step: '04', title: 'Beta Testing Labs', desc: 'Deploying build configurations to TestFlight and Google Play Console for real-world device testing.' },
  { step: '05', title: 'Store Release', desc: 'Managing listings and metadata updates, publishing to app stores, and configuring analytics telemetry.' },
];

function AppleIconWrapper(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20.94c1.88-2.33 3-5.07 3-8c0-3.31-2.69-6-6-6-3.31 0-6 2.69-6 6 0 2.93 1.12 5.67 3 8" />
      <path d="M18.66 8.86a2 2 0 1 1-2.83-2.83M12 2v4M12 12h.01" />
    </svg>
  );
}

export default function MobileDevServicePage() {
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
                  Mobile App Dev <br />
                  <span className="text-blue-600">Redefined.</span>
                </h1>
                <p className="text-lg text-slate-555 dark:text-slate-400 leading-relaxed mt-2 font-sans">
                  We engineer premium, performant, and secure mobile applications. From native Swift and Kotlin layers to highly responsive Flutter and React Native cross-platform code bases.
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

              {/* Right Column: Premium Smartphone Graphic */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: -2, y: 30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative max-w-lg w-full lg:ml-auto"
              >
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl animate-pulse"></div>
                <div className="relative rounded-[2.5rem] border-8 border-slate-900 bg-slate-950 overflow-hidden shadow-2xl aspect-[9/19] max-w-[280px] mx-auto">
                  {/* Speaker Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-slate-900 z-30 flex items-center justify-center">
                    <span className="w-8 h-1 rounded bg-slate-800"></span>
                  </div>
                  {/* Mockup screen content */}
                  <img
                    src="/images/unsplash/img-204a4aa2.webp"
                    alt="Mobile App Interface mockup"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ===== CAPABILITIES SECTION (WHY CHOOSE US STICKY SCROLL LAYOUT) ===== */}
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
                  We write clean, high-performance mobile code bases that leverage physical hardware parameters and deliver responsive user layouts.
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
                      viewport={{ once: true, margin: "-30px" }}
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
              We leverage modern architectures and verified frameworks to deploy lightweight mobile packages.
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
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
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
              <p className="text-slate-555 dark:text-slate-455 text-sm md:text-base leading-relaxed font-sans">
                We design apps that load instantly, secure local caches correctly, preserve device battery cycles, and maintain lightweight installation sizes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Zap className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Lightweight footprint</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Optimized asset bundles and strict layout sizes.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Search className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Offline Support</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Robust Realm and SQLite caching databases.</p>
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
                src="/images/unsplash/img-5ef227c4.webp"
                alt="Mobile Code App"
                fill
                className="object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Quality Guarantee</span>
                <h3 className="text-xl font-bold mt-1">Native Response Speed</h3>
                <p className="text-slate-400 text-xs mt-1 font-sans">We guarantee native UX response rates, dark mode support, and offline capability.</p>
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
                  Ready to build your next mobile app?
                </h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed font-sans">
                  Connect with our mobile specialists. Tell us about your technical specifications, platform preferences, and timelines.
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
