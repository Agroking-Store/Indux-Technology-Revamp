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
  Bot,
  MessageSquareCode,
  FolderSearch,
  Binary,
  AreaChart,
  Eye,
  Settings,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { 
  SiPython, 
  SiPytorch, 
  SiTensorflow, 
  SiHuggingface, 
  SiFastapi, 
  SiDocker 
} from 'react-icons/si';
import { FaDatabase } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// OpenAI API logo SVG representation
const OpenAiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.288 9.9c.287-.58.337-1.238.136-1.834a3.176 3.176 0 0 0-1.874-1.88 3.197 3.197 0 0 0-2.484.095A3.177 3.177 0 0 0 15.63 3.63a3.187 3.187 0 0 0-2.333-1.298c-.657-.043-1.309.18-1.834.618a3.177 3.177 0 0 0-2.88 0 3.19 3.19 0 0 0-1.833-2.124 3.18 3.18 0 0 0-2.333 1.3 3.177 3.177 0 0 0-2.438 2.652A3.192 3.192 0 0 0 .1 6.611a3.18 3.18 0 0 0 .136 1.835c-.201.597-.15 1.254.137 1.834a3.178 3.178 0 0 0 1.874 1.88c.755.281 1.6.25 2.332-.086a3.177 3.177 0 0 0 2.438 2.651c.525.437 1.177.66 1.834.618.657-.042 1.309-.34 1.834-.778a3.177 3.177 0 0 0 2.88 0c.525.438 1.177.66 1.834.618.657-.042 1.309-.34 1.834-.778a3.177 3.177 0 0 0 2.438-2.651 3.192 3.192 0 0 0 1.93-1.835c.201-.597.151-1.254-.136-1.834zM12.03 14.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

// Tech Stack List
const techStack = [
  { name: 'Python', category: 'Languages', desc: 'Core programming language', icon: SiPython, color: 'text-emerald-600 bg-emerald-600/10' },
  { name: 'OpenAI API', category: 'LLMs', desc: 'SOTA generative text & vision models', icon: OpenAiIcon, color: 'text-green-600 bg-green-600/10' },
  { name: 'PyTorch', category: 'Frameworks', desc: 'Advanced neural network compute', icon: SiPytorch, color: 'text-orange-600 bg-orange-600/10' },
  { name: 'TensorFlow', category: 'Frameworks', desc: 'Predictive modeling libraries', icon: SiTensorflow, color: 'text-amber-500 bg-amber-500/10' },
  { name: 'Pinecone', category: 'Databases', desc: 'High-speed vector semantics', icon: FaDatabase, color: 'text-blue-500 bg-blue-500/10' },
  { name: 'Hugging Face', category: 'Libraries', desc: 'Model repository fine-tuning', icon: SiHuggingface, color: 'text-yellow-500 bg-yellow-500/10' },
  { name: 'FastAPI', category: 'APIs', desc: 'Performant Python request hubs', icon: SiFastapi, color: 'text-cyan-500 bg-cyan-500/10' },
  { name: 'Docker', category: 'DevOps', desc: 'Isolated script execution builds', icon: SiDocker, color: 'text-sky-500 bg-sky-500/10' }
];

// Capabilities
const capabilities = [
  {
    title: 'Generative AI Apps',
    desc: 'Connecting systems with OpenAI, Anthropic, or open-source Llama structures to auto-generate context, code, or marketing drafts.',
    icon: Sparkles,
  },
  {
    title: 'Intelligent Chatbots',
    desc: 'Building intelligent support agents that analyze user intent, route calls correctly, and trigger automated database scripts.',
    icon: Bot,
  },
  {
    title: 'Retrieval-Augmented Generation (RAG)',
    desc: 'Indexing private internal documentation, PDFs, and corporate repositories into vector memory spaces for semantic AI lookup.',
    icon: FolderSearch,
  },
  {
    title: 'Vector Databases',
    desc: 'Architecting high-speed vector embeddings and query indexing using pgvector, Pinecone, or Milvus database engines.',
    icon: Database,
  },
  {
    title: 'Natural Language Processing (NLP)',
    desc: 'Automating text translation, customer review sentiment scoring, name extraction, and automated text indexing pipelines.',
    icon: MessageSquareCode,
  },
  {
    title: 'Predictive Analytics',
    desc: 'Writing ML regression and classification algorithms to forecast sales, track churn risks, and model user behavior patterns.',
    icon: AreaChart,
  },
  {
    title: 'Computer Vision Solutions',
    desc: 'Configuring object detection models, optical character recognition (OCR), face metrics, and automated video stream scanning.',
    icon: Eye,
  },
  {
    title: 'Autonomous AI Agents',
    desc: 'Orchestrating agent workflows (LangGraph) that autonomously check directories, call APIs, and execute complex script lists.',
    icon: Workflow,
  },
  {
    title: 'Model Fine-Tuning',
    desc: 'Training pre-existing base models on proprietary company dataset records to master highly technical terms and business protocols.',
    icon: Settings,
  },
  {
    title: 'Prompt Engineering',
    desc: 'Designing highly robust system prompts, structural few-shot variables, and JSON response constraints for LLM requests.',
    icon: Code,
  },
  {
    title: 'AI Security & Bias Filters',
    desc: 'Deploying input sanitizers, query rate limiting, and output moderation loops to protect user privacy and block system prompts leak.',
    icon: ShieldAlert,
  },
  {
    title: 'Telemetry & Evaluation',
    desc: 'Tracking token latency, cost metrics, cache rates, and response accuracy checks using LangSmith telemetry layers.',
    icon: Activity,
  },
];

const processSteps = [
  { step: '01', title: 'Data Audit & Scope', desc: 'Analyzing existing database records, file repositories, and determining the optimal AI model strategies.' },
  { step: '02', title: 'Vector Caching & RAG', desc: 'Splitting documents into chunks, embedding them, and building semantically searchable memory spaces.' },
  { step: '03', title: 'Pipeline Integration', desc: 'Connecting APIs, constructing LangChain orchestrators, and coding responsive frontend UI cards.' },
  { step: '04', title: 'Moderation & Moderation Tuning', desc: 'Testing response accuracy, configuring bias guardrails, and optimizing prompt system scopes.' },
  { step: '05', title: 'Hosting & Telemetry', desc: 'Deploying containerized models on cloud nodes, launching tracking dashboard panels, and tracking token costs.' },
];

export default function AiSolutionsServicePage() {
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
                  AI Solutions <br />
                  <span className="text-blue-600">Redefined.</span>
                </h1>
                <p className="text-lg text-slate-555 dark:text-slate-400 leading-relaxed mt-2 font-sans">
                  We integrate advanced machine learning and cognitive computing logic. Connect your databases with LLM services, establish secure semantic storage, and automate decision making.
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

              {/* Right Column: Premium AI mockup browser graphic */}
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
                      induxtech.com/ai-solutions
                    </div>
                  </div>
                  {/* Illustration Image */}
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
                    alt="AI Solutions Mockup"
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
                  We cover everything from smart reasoning chat interfaces and secure RAG indexing pipelines to predictive classifiers and custom visual scan systems.
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
              We leverage modern language models, neural network layers, and semantic indexing databases.
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
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-555 dark:text-slate-400">
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

        {/* ===== PROCESS SECTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/60 dark:border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Our Process</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-sans">
              We employ a rigorous, milestone-driven framework that guarantees accuracy and pipeline safety.
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
                Accuracy and Compliance.
              </h2>
              <p className="text-slate-555 dark:text-slate-455 text-sm md:text-base leading-relaxed font-sans">
                Our AI pipelines isolate customer dataset calls, enforce strict rate limit budgets to control token expenses, and prevent system prompts bypass vulnerabilities.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Zap className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Low-Latency Memory</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Vector searches matching under 15ms response windows.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Search className="size-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Secure RAG Storage</h4>
                  <p className="text-slate-455 dark:text-slate-550 text-xs leading-relaxed font-sans">Isolated content indexes with access filters.</p>
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
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
                alt="AI Development Coding screen"
                fill
                className="object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Quality Guarantee</span>
                <h3 className="text-xl font-bold mt-1">Accuracy Evaluators</h3>
                <p className="text-slate-400 text-xs mt-1 font-sans">We guarantee strict input/output moderation filters and prompt protection.</p>
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
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to integrate AI into your workflow?</h2>
              <p className="text-blue-100 text-base leading-relaxed font-sans">
                Connect with our AI integration specialists. Tell us about your operational databases, data sheets, and security requirements.
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
