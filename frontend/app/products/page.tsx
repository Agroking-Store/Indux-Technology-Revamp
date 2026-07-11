"use client";

import React, { useState } from "react";
import { motion, AnimatePresence,Variants } from "framer-motion";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Activity,
  ArrowRight, 
  Sparkles, 
  Sprout, 
  BarChart3, 
  Settings, 
  Heart,
  Plus,
  Package
} from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Indux CRM",
    category: "CRM Platform",
    description: "Engineered a highly scalable generative styling engine leveraging computer vision to recommend highly personalized outfits in real-time.",
    themeColor: "blue",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
    features: ["Lead & Pipeline Management", "Automated Email Sequences", "Real-time Sales Analytics"],
    benefits: ["Increase sales conversion rates", "Reduce manual data entry", "Enhance customer relationships"]
  },
  {
    id: 2,
    title: "Bill Tea",
    category: "Enterprise System",
    description: "Developed a deep learning diagnostic tool utilizing Convolutional Neural Networks (CNNs) to analyze crop health from anonymous uploads.",
    themeColor: "emerald",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?q=80&w=1200&auto=format&fit=crop",
    features: ["CNN / PyTorch Architecture", "Anonymous Upload Engines", "Computer Vision Integration"],
    benefits: ["Real-time crop health analysis", "Early disease detection", "Increased agricultural yield"]
  },
  {
    id: 3,
    title: "JEM Soft",
    category: "LIC Software",
    description: "Architected a secure symptom matrix system that communicates with remote servers utilizing advanced CKKS Homomorphic Encryption.",
    themeColor: "indigo",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    features: ["Homomorphic Encryption (CKKS)", "Secure Patient Data Flow", "Remote Server Communication"],
    benefits: ["Zero-knowledge data protection", "HIPAA & GDPR Compliance", "Uncompromised computational power"]
  },
  {
    id: 4,
    title: "Sales Automation",
    category: "AI Tool",
    description: "Built a complex raw material tracking and interactive statistics dashboard designed for high-stakes industrial operations.",
    themeColor: "cyan",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    features: ["Predictive Sales Forecasting", "Dynamic Lead Scoring", "Automated Follow-ups"],
    benefits: ["Shorter sales cycles", "Higher closing percentages", "Elimination of busywork"]
  },
  {
    id: 5,
    title: "Indux ERP",
    category: "Operations",
    description: "Built a comprehensive Enterprise Resource Planning suite that unifies finance, supply chain, and human resources into one ecosystem.",
    themeColor: "blue",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    features: ["Unified Supply Chain Tracking", "Financial Ledger Automation", "Multi-department Sync"],
    benefits: ["Streamlined business operations", "Real-time resource visibility", "Reduced operational overhead"]
  },
  {
    id: 6,
    title: "HRMS Suite",
    category: "Human Resources",
    description: "Advanced human capital management platform with predictive attrition modeling and automated payroll workflows.",
    themeColor: "emerald",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    features: ["Predictive Attrition AI", "Automated Payroll Processing", "Employee Self-Service Portal"],
    benefits: ["Improved employee retention", "Zero payroll calculation errors", "Reduced HR workload"]
  },
  {
    id: 7,
    title: "Indux Properties",
    category: "Real Estate",
    description: "Next-generation property management software featuring virtual tours, automated tenant screening, and lease lifecycle tracking.",
    themeColor: "indigo",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
    features: ["Virtual Tour Hosting", "Automated Tenant Screening", "Digital Lease Management"],
    benefits: ["Faster property turnarounds", "Higher quality tenants", "Paperless legal workflows"]
  },
  {
    id: 8,
    title: "Card 360",
    category: "Fintech",
    description: "Secure payment gateway and card management system equipped with real-time fraud detection algorithms.",
    themeColor: "cyan",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    features: ["Real-time Fraud Detection", "Multi-currency Processing", "API Payment Gateway"],
    benefits: ["Bank-grade security", "Global payment acceptance", "Reduced chargeback rates"]
  },
  {
    id: 9,
    title: "Dnyaypath",
    category: "Legal ERP",
    description: "Specialized legal practice management system designed to automate case tracking and secure client communications.",
    themeColor: "blue",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200&auto=format&fit=crop",
    features: ["Automated Case Tracking", "Secure Client Portals", "Billable Hour Logging"],
    benefits: ["Flawless case organization", "Enhanced attorney-client trust", "Accurate legal billing"]
  },
];

// Tailwind dynamic color mappings
const colorMap: Record<string, any> = {
  blue: { bg: "bg-blue-500", bgLight: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500", buttonHover: "hover:bg-blue-600" },
  emerald: { bg: "bg-emerald-500", bgLight: "bg-emerald-50", text: "text-emerald-600", icon: "text-emerald-500", buttonHover: "hover:bg-emerald-600" },
  cyan: { bg: "bg-cyan-500", bgLight: "bg-cyan-50", text: "text-cyan-600", icon: "text-cyan-500", buttonHover: "hover:bg-cyan-600" },
  indigo: { bg: "bg-indigo-500", bgLight: "bg-indigo-50", text: "text-indigo-600", icon: "text-indigo-500", buttonHover: "hover:bg-indigo-600" }
};

const cardContentVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.15, // Delay between each text element appearing
        delayChildren: 0.2     // Wait a bit before starting the text animation
      } 
    }
  };
  
  const textItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

export default function ProductsZigzagShowcase() {
  const [visibleCount, setVisibleCount] = useState(4);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, projects.length));
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] py-24 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background ambient gradient */}
      <div className="absolute left-0 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* --- Header Section --- */}
        <div className="mb-24 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5"
          >
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-600">Flagship Solutions</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
          >
            Our <span className="text-blue-600">Innovative Products</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl space-y-2 text-slate-600"
          >
            <p className="text-lg font-medium text-slate-700">
              Innovative solutions built to transform industries and drive business success.
            </p>
            <p className="text-sm">
              Industry-leading products designed to solve complex business challenges and accelerate digital transformation.
            </p>
          </motion.div>
        </div>

        {/* --- Products List (Alternating Zigzag with Staggered Text) --- */}
        <motion.div layout className="flex flex-col gap-24 lg:gap-32">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              const theme = colorMap[project.themeColor];
              const Icon = project.icon;

              return (
                <div 
                  key={project.id} 
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
                          src={project.image} 
                          alt={project.title} 
                          className="h-64 w-full object-cover sm:h-80 lg:h-96"
                        />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Content Side with Staggered Elements */}
                  <motion.div 
                    variants={cardContentVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 lg:w-1/2 lg:p-12"
                  >
                    {/* Tag */}
                    <motion.div variants={textItemVariants} className={`mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 ${theme.bgLight}`}>
                      <Icon className={`h-3 w-3 ${theme.icon}`} />
                      <span className={`text-xs font-bold ${theme.text}`}>
                        {project.category}
                      </span>
                    </motion.div>
                    
                    {/* Title */}
                    <motion.h2 variants={textItemVariants} className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                      {project.title}
                    </motion.h2>
                    
                    {/* Description */}
                    <motion.p variants={textItemVariants} className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {project.description}
                    </motion.p>

                    {/* Features & Benefits Grid */}
                    <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <motion.div variants={textItemVariants}>
                        <div className="mb-4 flex items-center gap-2 text-slate-900">
                          <Settings className={`h-5 w-5 ${theme.icon}`} />
                          <h3 className="font-bold">Key Features</h3>
                        </div>
                        <ul className="space-y-3">
                          {project.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm">
                              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.icon}`} />
                              <span className="leading-tight">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div variants={textItemVariants}>
                        <div className="mb-4 flex items-center gap-2 text-slate-900">
                          <Heart className={`h-5 w-5 ${theme.icon}`} />
                          <h3 className="font-bold">Benefits</h3>
                        </div>
                        <ul className="space-y-3">
                          {project.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm">
                              <ShieldCheck className={`mt-0.5 h-4 w-4 shrink-0 text-blue-500`} />
                              <span className="leading-tight">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Button */}
                    <motion.div variants={textItemVariants}>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-colors ${theme.bg} ${theme.buttonHover}`}
                      >
                        Explore Details <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  </motion.div>

                </div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* --- Load More Button --- */}
        <AnimatePresence>
          {hasMore && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-24 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoadMore}
                className="group flex items-center gap-3 rounded-full border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-600 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              >
                <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                Display More Solutions
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
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
                <a href={"/contact-us"}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-blue-600 shadow-lg transition-colors hover:bg-slate-50"
              >
                Get in Touch <ArrowRight className="h-4 w-4" />
              </motion.button>
              </a>
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