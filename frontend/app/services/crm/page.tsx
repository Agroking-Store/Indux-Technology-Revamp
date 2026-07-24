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
  Briefcase
} from 'lucide-react';
import { 
  FaPython, 
  FaJava, 
  FaNodeJs,
  FaDatabase,
  FaSalesforce,
  FaHubspot
} from 'react-icons/fa';
import { 
  TbBrandTypescript, 
  TbBrandMongodb
} from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Tech stack data
const techStack = [
  { name: 'Salesforce', category: 'Platforms', desc: 'Enterprise CRM ecosystem', icon: FaSalesforce, color: 'text-blue-500 bg-blue-500/10' },
  { name: 'HubSpot', category: 'Platforms', desc: 'Inbound marketing & sales', icon: FaHubspot, color: 'text-orange-500 bg-orange-500/10' },
  { name: 'TypeScript', category: 'Languages', desc: 'Type-safe JS architecture', icon: TbBrandTypescript, color: 'text-blue-600 bg-blue-600/10' },
  { name: 'Python', category: 'Languages', desc: 'Data processing & AI computing', icon: FaPython, color: 'text-emerald-600 bg-emerald-600/10' },
  { name: 'Java', category: 'Languages', desc: 'Robust enterprise processes', icon: FaJava, color: 'text-rose-500 bg-rose-500/10' },
  { name: 'Node.js', category: 'Backend', desc: 'High-performance runtimes', icon: FaNodeJs, color: 'text-green-600 bg-green-600/10' },
  { name: 'PostgreSQL', category: 'Databases', desc: 'Structured relational data', icon: FaDatabase, color: 'text-blue-600 bg-blue-600/10' },
  { name: 'MongoDB', category: 'Databases', desc: 'Scalable NoSQL document stores', icon: TbBrandMongodb, color: 'text-emerald-500 bg-emerald-500/10' },
];

// 12 capabilities for CRM
const capabilities = [
  {
    title: 'Custom CRM Development',
    desc: 'Bespoke customer relationship management systems built from the ground up to match your unique business workflows and data requirements.',
    icon: Settings,
  },
  {
    title: 'CRM Implementation',
    desc: 'Expert deployment and configuration of industry-leading platforms like Salesforce, HubSpot, and Microsoft Dynamics.',
    icon: Cloud,
  },
  {
    title: 'Data Migration Services',
    desc: 'Secure and seamless data extraction, transformation, and loading (ETL) from legacy systems to your new CRM environment.',
    icon: Database,
  },
  {
    title: 'Workflow Automation',
    desc: 'Automating repetitive sales, marketing, and support tasks to increase team productivity and reduce human error.',
    icon: Workflow,
  },
  {
    title: 'Analytics & Reporting',
    desc: 'Advanced dashboarding and reporting features to provide real-time insights into sales pipelines and customer behavior.',
    icon: BarChart3,
  },
  {
    title: 'Third-Party Integrations',
    desc: 'Connecting your CRM with ERPs, payment gateways, marketing automation tools, and other essential business software.',
    icon: Activity,
  },
  {
    title: 'Customer Portals',
    desc: 'Developing self-service portals that integrate directly with your CRM, empowering customers to manage their own accounts and support tickets.',
    icon: Users,
  },
  {
    title: 'Omnichannel Support',
    desc: 'Integrating email, chat, phone, and social media channels into a unified interface for your support team.',
    icon: MessageSquare,
  },
  {
    title: 'Lead Management Systems',
    desc: 'Streamlining lead capture, scoring, and routing to ensure your sales team focuses on the highest-priority opportunities.',
    icon: Target,
  },
  {
    title: 'Mobile CRM Applications',
    desc: 'Providing your field sales and service teams with secure, mobile-optimized access to CRM data on the go.',
    icon: Zap,
  },
  {
    title: 'Security & Compliance',
    desc: 'Ensuring your CRM adheres to strict data privacy regulations (GDPR, CCPA) with role-based access control and encryption.',
    icon: ShieldCheck,
  },
  {
    title: 'Training & Support',
    desc: 'Comprehensive user training programs and ongoing technical support to drive adoption and maximize your CRM investment.',
    icon: Briefcase,
  },
];

const processSteps = [
  { step: '01', title: 'Needs Assessment', desc: 'We analyze your sales processes, customer touchpoints, and pain points to define clear CRM objectives.' },
  { step: '02', title: 'Solution Design', desc: 'Mapping out the data architecture, user roles, and integration touchpoints for the proposed CRM system.' },
  { step: '03', title: 'Development & Configuration', desc: 'Building custom features or configuring the chosen platform to align perfectly with your business model.' },
  { step: '04', title: 'Data Migration & Testing', desc: 'Safely transferring your existing data and conducting rigorous testing to ensure system accuracy and performance.' },
  { step: '05', title: 'Deployment & Training', desc: 'Rolling out the system to your teams, accompanied by comprehensive training and post-launch support.' },
];

export default function CRMServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative font-sans">
      
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none"></div>
      <div className="absolute top-[50%] right-[-15%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none"></div>

      <main className="flex-grow">
        {/* ===== HERO SECTION ===== */}
        <section className="relative pt-10 pb-12 lg:pt-14 lg:pb-16 font-sans">
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
                  CRM Solutions <br />
                  <span className="text-blue-600">Redefined.</span>
                </h1>
                <p className="text-lg text-slate-555 dark:text-slate-400 leading-relaxed mt-2 font-sans">
                  We design, implement, and customize Customer Relationship Management platforms that empower your sales, marketing, and support teams to build lasting connections.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mt-4">
                  <Button
                    nativeButton={false}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                    render={<Link href="/contact-us" />}
                  >
                    Start Your Project
                  </Button>
                  <Button
                    nativeButton={false}
                    variant="ghost"
                    className="w-full sm:w-auto px-8 py-6 rounded-full font-medium text-base text-slate-700 dark:text-slate-350 hover:bg-slate-200/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/80 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
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
                      induxtech.com/crm
                    </div>
                  </div>
                  {/* Illustration Image */}
                  <img
                    src="/images/unsplash/img-4a096fc5.webp"
                    alt="CRM Dashboard Mockup"
                    className="w-full h-auto object-cover opacity-90 hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ===== CAPABILITIES SECTION ===== */}
        <section id="capabilities" className="relative overflow-visible border-t border-slate-200/60 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            
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
                  We cover everything from initial implementation and data migration to complex workflow automation and custom portal development.
                </p>

                <Button 
                  nativeButton={false}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 group"
                  render={<Link href="/contact-us" />}
                >
                  Consult with Our Experts <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Right Column: Scrollable Cards */}
              <div className="w-full lg:w-7/12 flex flex-col gap-6 lg:gap-8 lg:pb-32">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 border-t border-slate-200/60 dark:border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Our Tech Stack</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
              We leverage top-tier CRM platforms and robust programming ecosystems to build scalable, reliable, and secure solutions.
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 border-t border-slate-200/60 dark:border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Our Process</h2>
            <p className="text-slate-555 dark:text-slate-455 text-sm md:text-base leading-relaxed font-sans">
              We employ a structured, milestone-driven framework that guarantees transparency and precise execution.
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 border-t border-slate-200/60 dark:border-slate-900">
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
                Scale and Usability.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                We design CRM platforms that not only handle immense volumes of customer data securely but also provide an intuitive, friction-free experience for your team.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Workflow className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Seamless Integrations</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Unifying your toolset through secure API connectivity.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Data Security</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Robust encryption and strict role-based access controls.</p>
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
                src="/images/unsplash/img-bbad54bc.webp"
                alt="CRM Data Dashboard"
                fill
                className="object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Quality Guarantee</span>
                <h3 className="text-xl font-bold mt-1">100% Data Accuracy</h3>
                <p className="text-slate-400 text-xs mt-1 font-sans">We guarantee safe data migrations with zero loss or corruption.</p>
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
                  Ready to transform your customer relationships?
                </h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed font-sans">
                  Connect with our CRM specialists. Tell us about your sales processes, team structure, and growth objectives.
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
