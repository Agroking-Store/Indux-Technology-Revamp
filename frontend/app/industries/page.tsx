"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Leaf, 
  Factory, 
  ShoppingBag,
  Settings,
  Heart,
  Globe
} from "lucide-react";

// --- Industries Data (Expanded to match the screenshot's Features/Benefits structure) ---
const industries = [
  {
    id: "healthcare",
    title: "Healthcare & Life Sciences",
    tag: "Privacy-Preserving Diagnostics",
    description: "Engineering secure diagnostic engines and encrypted health matrices. We build systems ensuring zero-knowledge patient data protection without sacrificing computational power.",
    themeColor: "blue",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1576091160550-2173ff9e9e9c?q=80&w=1200&auto=format&fit=crop", 
    features: [
      "Homomorphic Encryption (CKKS)",
      "Secure Patient Data Flow",
      "AI-Powered Diagnostic Engines",
      "Symptom Matrix Systems",
      "Remote Server Communication"
    ],
    benefits: [
      "Zero-knowledge data protection",
      "HIPAA & GDPR Compliance",
      "Uncompromised computational power",
      "Enhanced patient trust",
      "Streamlined medical operations"
    ]
  },
  {
    id: "agritech",
    title: "Agriculture & Agri-Tech",
    tag: "Autonomous Crop Intelligence",
    description: "Deploying deep learning tools and convolutional neural networks for autonomous crop health analysis. We turn raw visual data into actionable agricultural insights.",
    themeColor: "emerald",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop", 
    features: [
      "Convolutional Neural Networks (CNN)",
      "PyTorch & Flask Architecture",
      "Computer Vision Integration",
      "Anonymous Upload Engines",
      "Yield Optimization Algorithms"
    ],
    benefits: [
      "Real-time crop health analysis",
      "Early disease detection",
      "Increased agricultural yield",
      "Data-driven farming decisions",
      "Reduced crop loss"
    ]
  },
  {
    id: "manufacturing",
    title: "Industrial & Manufacturing",
    tag: "Process Validation & Analytics",
    description: "Architecting complex raw material tracking and interactive statistics dashboards. We streamline supply chains and automate compliance for high-stakes industrial operations.",
    themeColor: "cyan",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop", 
    features: [
      "Complex PostgreSQL Tracking",
      "Interactive BI Dashboards",
      "Process Auditing & Validation",
      "Raw Material Management",
      "Supply Chain Automation"
    ],
    benefits: [
      "Streamlined supply chains",
      "Automated industrial compliance",
      "High-stakes operational visibility",
      "Reduced material waste",
      "Optimized production workflows"
    ]
  },
  {
    id: "retail",
    title: "Retail & E-Commerce",
    tag: "Generative Personalization",
    description: "Building scalable generative styling engines that leverage computer vision to recommend highly personalized outfits, driving next-generation retail experiences.",
    themeColor: "indigo",
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop", 
    features: [
      "Generative AI Styling Engines",
      "Real-time Computer Vision",
      "React Native Mobile Architectures",
      "Dynamic Outfit Recommendations",
      "User Preference Tracking"
    ],
    benefits: [
      "Highly personalized shopping",
      "Next-gen retail experiences",
      "Increased conversion rates",
      "Enhanced customer retention",
      "Data-driven inventory planning"
    ]
  }
];

// Map for dynamic Tailwind colors based on the theme
const colorMap: Record<string, any> = {
  blue: { bg: "bg-blue-500", bgLight: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500", buttonHover: "hover:bg-blue-600" },
  emerald: { bg: "bg-emerald-500", bgLight: "bg-emerald-50", text: "text-emerald-600", icon: "text-emerald-500", buttonHover: "hover:bg-emerald-600" },
  cyan: { bg: "bg-cyan-500", bgLight: "bg-cyan-50", text: "text-cyan-600", icon: "text-cyan-500", buttonHover: "hover:bg-cyan-600" },
  indigo: { bg: "bg-indigo-500", bgLight: "bg-indigo-50", text: "text-indigo-600", icon: "text-indigo-500", buttonHover: "hover:bg-indigo-600" }
};

export default function IndustriesShowcase() {
  return (
    <div className="min-h-screen bg-[#fafbfc] py-24 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background ambient gradient */}
      <div className="absolute left-0 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* --- Header Section --- */}
        <div className="mb-24 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5"
          >
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-600">Ecosystem Impact</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
          >
            Industries <span className="text-blue-600">We Serve</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl space-y-2 text-slate-600"
          >
            <p className="text-lg font-medium text-slate-700">
              Innovative solutions built to transform industries and drive business success.
            </p>
            <p className="text-sm">
              Delivering highly specialized, scalable software architectures tailored to the unique complexities of modern verticals.
            </p>
          </motion.div>
        </div>

        {/* --- Industries List (Alternating Zigzag Layout) --- */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {industries.map((industry, index) => {
            const isEven = index % 2 === 0;
            const theme = colorMap[industry.themeColor];
            const Icon = industry.icon;

            return (
              <div 
                key={industry.id} 
                className={`flex flex-col items-center gap-12 lg:gap-16 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}
              >
                
                {/* Image Side (Mockup Style) */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative rounded-3xl bg-slate-100 p-4 shadow-xl shadow-slate-200/50 sm:p-6 lg:p-8">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <img 
                        src={industry.image} 
                        alt={industry.title} 
                        className="h-64 w-full object-cover sm:h-80 lg:h-96"
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="w-full rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 lg:w-1/2 lg:p-12"
                >
                  <div className={`mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 ${theme.bgLight}`}>
                    <Icon className={`h-3 w-3 ${theme.icon}`} />
                    <span className={`text-xs font-bold ${theme.text}`}>
                      {industry.tag}
                    </span>
                  </div>
                  
                  <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                    {industry.title}
                  </h2>
                  
                  <p className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {industry.description}
                  </p>

                  <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {/* Key Capabilities (Features) */}
                    <div>
                      <div className="mb-4 flex items-center gap-2 text-slate-900">
                        <Settings className={`h-5 w-5 ${theme.icon}`} />
                        <h3 className="font-bold">Key Capabilities</h3>
                      </div>
                      <ul className="space-y-3">
                        {industry.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm">
                            <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.icon}`} />
                            <span className="leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sector Benefits */}
                    <div>
                      <div className="mb-4 flex items-center gap-2 text-slate-900">
                        <Heart className={`h-5 w-5 ${theme.icon}`} />
                        <h3 className="font-bold">Sector Benefits</h3>
                      </div>
                      <ul className="space-y-3">
                        {industry.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm">
                            <ShieldCheck className={`mt-0.5 h-4 w-4 shrink-0 text-blue-500`} />
                            <span className="leading-tight">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-colors ${theme.bg} ${theme.buttonHover}`}
                  >
                    Explore Industry Solutions <ArrowRight className="h-4 w-4" />
                  </motion.button>

                </motion.div>
              </div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-32 overflow-hidden rounded-[2.5rem] bg-blue-600 px-6 py-16 text-center sm:px-16"
        >
          {/* Decorative background curves */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-black/10 blur-2xl" />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Activity className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to Scale Your Infrastructure?
            </h2>
            
            <p className="mb-10 text-blue-100">
              Contact us to learn more about how our engineering solutions can benefit your organization and accelerate your digital transformation journey.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-blue-600 shadow-lg transition-colors hover:bg-slate-50"
              >
                Get in Touch <ArrowRight className="h-4 w-4" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 rounded-full border border-blue-400 bg-blue-600/50 px-8 py-3.5 font-bold text-white backdrop-blur-sm transition-colors hover:bg-blue-500"
              >
                Explore Solutions <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}