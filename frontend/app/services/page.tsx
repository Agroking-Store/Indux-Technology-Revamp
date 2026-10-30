"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Database,
  Workflow,
  BarChart3,
  Layers,
  Cpu,
  Smartphone,
  Bot,
  Factory,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { GetQuoteModal } from "@/components/GetQuoteModal";

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        id="services-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "IT Services",
            "provider": {
              "@type": "Organization",
              "name": "Indux Technology"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "IT Services",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom CRM Solutions" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Development" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Development" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI & Business Automation" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Chatbots" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ERP Software" } }
              ]
            }
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-20 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            alt="High-tech professional IT background"
            className="w-full h-full object-cover opacity-10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdepPcUqWQb-AvSbx-mPzI5Crwpvmi02OxS4GFzCKt-h2KiecG9Rys_cgYTOJTyjLYS7llW3Q8vb9irsUttkpKJoKBQvydmhMh7a9-RsZ8FIlFNlrcXMAvF4Q5W9DVPCu3zVA7g_yvrp67UA3nBclcMDbQDW_QAPOhd-Y5TEF8DOEx4q5csZaAVW5TjhXtHmRiMu-GbkmD34QiOflsK4kIODgdYtodC87c_6g1eBst_xOQPkYq_Rx2fQ"
            fill
            priority={true}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground mb-6">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Expert Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl text-foreground mb-6 max-w-4xl mx-auto font-bold tracking-tight">
            Software services for growing businesses
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Whether you need to organise your sales pipeline, run a factory more efficiently, or launch a new custom app, we design, build, and support software that fits how you work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#services"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-md"
            >
              Explore Capabilities <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 border border-border bg-background hover:bg-muted text-foreground px-8 py-3.5 rounded-full text-sm font-semibold transition-all"
            >
              Discuss Your Project
            </Link>
          </div>
        </div>
      </section>

      {/* Services Showcase Grid */}
      <section id="services" className="py-24 sm:py-32 bg-muted/30 border-y border-border/50 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 sm:mb-28">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4">Core Capabilities</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Purpose-built technology solutions designed to drive operational efficiency, automate workflows, and accelerate sustainable growth.
            </p>
          </div>

          <div className="flex flex-col items-center gap-20 sm:gap-28 md:gap-36">

            {/* Row 1: Custom CRM Development */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 w-full relative">
              <div className="relative shrink-0 flex items-center justify-center w-full lg:w-5/12">
                <span className="absolute -left-4 sm:-left-10 lg:-left-16 text-7xl sm:text-8xl md:text-[11rem] lg:text-[13rem] font-extrabold text-[#b4c5ff] dark:text-blue-950/60 opacity-30 pointer-events-none z-0 select-none tracking-tighter leading-none -top-10 sm:-top-16">
                  01
                </span>
                <div
                  className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-92 group overflow-hidden z-10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <Image
                    alt="Custom CRM Solutions for Growing Business"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="/services/crm-banner.webp"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              <div className="w-full lg:w-7/12 text-center lg:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Sparkles className="size-3.5" /> Custom CRM Development
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 leading-tight">
                  CRM Software Designed Around Your Business
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                  Every business has unique processes and customer needs. We develop customized CRM software tailored to your workflows, business goals, and operational requirements, giving your team the flexibility to work smarter and scale confidently.
                </p>

                {/* 4 Feature Cards from PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <CheckCircle2 className="size-4 text-blue-600 shrink-0" />
                      Tailored CRM Features
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Get the modules, fields, and functionality your business needs without unnecessary complexity.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Workflow className="size-4 text-blue-600 shrink-0" />
                      Seamless System Integration
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Connect your CRM with websites, email platforms, payment gateways, and other business applications.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <ShieldCheck className="size-4 text-blue-600 shrink-0" />
                      Role-Based Access Control
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Manage user permissions and protect business information with access tailored to different team roles.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <BarChart3 className="size-4 text-blue-600 shrink-0" />
                      Built for Business Growth
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Extend your CRM with new features and automated workflows as your team and business requirements evolve.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/services/crm"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider shadow-md hover:scale-105"
                  >
                    Explore Custom CRM <ChevronRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                  >
                    Discuss Your Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Row 2: Custom Software Development */}
            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-10 lg:gap-16 w-full relative">
              <div className="relative shrink-0 flex items-center justify-center w-full lg:w-5/12">
                <span className="absolute -right-4 sm:-right-10 lg:-right-16 text-7xl sm:text-8xl md:text-[11rem] lg:text-[13rem] font-extrabold text-[#b4c5ff] dark:text-blue-950/60 opacity-30 pointer-events-none z-0 select-none tracking-tighter leading-none -top-10 sm:-top-16">
                  02
                </span>
                <div
                  className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-92 group overflow-hidden z-10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <Image
                    alt="Custom Software Development Built for Your Business Needs"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="/services/web-dev-banner.webp"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              <div className="w-full lg:w-7/12 text-center lg:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Layers className="size-3.5" /> Custom Software Engineering
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 leading-tight">
                  Software Solutions Built for Your Business Needs
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                  Transform your ideas into reliable software with solutions designed around your business objectives. From internal business applications to complex enterprise platforms, we build scalable, secure, and user-friendly software that streamlines operations and supports long-term growth.
                </p>

                {/* 4 Feature Cards from PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Zap className="size-4 text-blue-600 shrink-0" />
                      Business Process Automation
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Simplify repetitive tasks and improve operational efficiency across your departments.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Layers className="size-4 text-blue-600 shrink-0" />
                      Web Application Development
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Build responsive, feature-rich web applications tailored for your customers and internal teams.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Database className="size-4 text-blue-600 shrink-0" />
                      Enterprise Software Solutions
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Connect business operations through centralized, purpose-built digital architectures.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <BarChart3 className="size-4 text-blue-600 shrink-0" />
                      Scalable Architecture
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Create software that can adapt smoothly to growing user numbers, data volumes, and business demands.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/services/web-dev"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider shadow-md hover:scale-105"
                  >
                    Explore Custom Software <ChevronRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                  >
                    Discuss Your Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Row 3: Mobile App Development */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 w-full relative">
              <div className="relative shrink-0 flex items-center justify-center w-full lg:w-5/12">
                <span className="absolute -left-4 sm:-left-10 lg:-left-16 text-7xl sm:text-8xl md:text-[11rem] lg:text-[13rem] font-extrabold text-[#b4c5ff] dark:text-blue-950/60 opacity-30 pointer-events-none z-0 select-none tracking-tighter leading-none -top-10 sm:-top-16">
                  03
                </span>
                <div
                  className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-92 group overflow-hidden z-10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <Image
                    alt="Mobile Apps for Seamless User Experience and Cross-Platform Compatibility"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="/services/mobile-dev-banner.webp"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              <div className="w-full lg:w-7/12 text-center lg:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Smartphone className="size-3.5" /> Mobile App Engineering
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 leading-tight">
                  High-Performance Native & Cross-Platform Apps
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                  Deliver intuitive, fluid mobile experiences designed around how your customers and on-field workforce operate. We build secure iOS, Android, and cross-platform applications that retain users and scale smoothly.
                </p>

                {/* 4 Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Smartphone className="size-4 text-blue-600 shrink-0" />
                      iOS & Android Engineering
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Native Swift and Kotlin apps optimized for buttery-smooth animations and OS integration.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Layers className="size-4 text-blue-600 shrink-0" />
                      Flutter & React Native
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Cross-platform efficiency delivering simultaneous iOS and Android releases from a single codebase.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Database className="size-4 text-blue-600 shrink-0" />
                      Offline-First Reliability
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Local SQLite and Realm caching ensuring uninterrupted workflows even without network coverage.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Zap className="size-4 text-blue-600 shrink-0" />
                      Push & Telemetry Analytics
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Automated push notifications, crash telemetry, and in-app analytics to boost customer retention.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/services/mobile-dev"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider shadow-md hover:scale-105"
                  >
                    Discuss Your App <ChevronRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                  >
                    Discuss Your Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Row 4: AI & Business Automation */}
            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-10 lg:gap-16 w-full relative">
              <div className="relative shrink-0 flex items-center justify-center w-full lg:w-5/12">
                <span className="absolute -right-4 sm:-right-10 lg:-right-16 text-7xl sm:text-8xl md:text-[11rem] lg:text-[13rem] font-extrabold text-[#b4c5ff] dark:text-blue-950/60 opacity-30 pointer-events-none z-0 select-none tracking-tighter leading-none -top-10 sm:-top-16">
                  04
                </span>
                <div
                  className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-92 group overflow-hidden z-10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <Image
                    alt="AI & Business Automation"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="/services/automation-banner.webp"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              <div className="w-full lg:w-7/12 text-center lg:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Workflow className="size-3.5" /> Intelligent Automation
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 leading-tight">
                  Automate Repetitive Workflows & Drive Efficiency
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                  Eliminate time-consuming manual data entry, streamline multi-app handoffs, and accelerate business operations. We build resilient event-driven pipelines that free your team to focus on high-value strategy and growth.
                </p>

                {/* 4 Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Zap className="size-4 text-blue-600 shrink-0" />
                      Automate Repetitive Workflows
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Trigger-based background actions that update databases, assign leads, and notify teams in real time.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Workflow className="size-4 text-blue-600 shrink-0" />
                      Connect Your Business Tools
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Custom webhook pipelines linking CRM, billing software, email servers, and operational tools.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Cpu className="size-4 text-blue-600 shrink-0" />
                      Intelligent Document Processing
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Automated OCR and parsing for purchase orders, invoices, KYC docs, and customer inquiries.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <BarChart3 className="size-4 text-blue-600 shrink-0" />
                      Real-Time Business Insights
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Automated daily and weekly pipeline performance digests delivered straight to Slack or WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/services/automation"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider shadow-md hover:scale-105"
                  >
                    Explore Automation <ChevronRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                  >
                    Discuss Your Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Row 5: AI Chatbots */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 w-full relative">
              <div className="relative shrink-0 flex items-center justify-center w-full lg:w-5/12">
                <span className="absolute -left-4 sm:-left-10 lg:-left-16 text-7xl sm:text-8xl md:text-[11rem] lg:text-[13rem] font-extrabold text-[#b4c5ff] dark:text-blue-950/60 opacity-30 pointer-events-none z-0 select-none tracking-tighter leading-none -top-10 sm:-top-16">
                  05
                </span>
                <div
                  className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-92 group overflow-hidden z-10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <Image
                    alt="AI Chatbots"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="/services/ai-chatbots-banner.webp"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              <div className="w-full lg:w-7/12 text-center lg:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Bot className="size-3.5" /> Conversational AI
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 leading-tight">
                  24/7 AI Assistants Trained on Your Knowledge Base
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                  Intelligent conversational agents that automate customer support, guide prospective clients, and qualify inbound leads 24/7. Our AI models learn directly from your company data to deliver personalized, accurate answers.
                </p>

                {/* 4 Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Sparkles className="size-4 text-blue-600 shrink-0" />
                      Domain-Specific Training
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Custom fine-tuning with vector semantics on your documentation, catalogs, and service guidelines.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Workflow className="size-4 text-blue-600 shrink-0" />
                      Omnichannel Deployment
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Embed conversational assistants directly into websites, WhatsApp, mobile apps, and portal dashboards.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <ShieldCheck className="size-4 text-blue-600 shrink-0" />
                      Seamless Human Escalation
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Smart intent evaluation that automatically routes high-priority customer conversations to human agents.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <BarChart3 className="size-4 text-blue-600 shrink-0" />
                      Lead Capture & CRM Sync
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Capture contact details during chat and sync them instantly into your CRM pipeline.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/services/ai-chatbots"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider shadow-md hover:scale-105"
                  >
                    Learn More <ChevronRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                  >
                    Discuss Your Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Row 6: Manufacturing ERP */}
            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-10 lg:gap-16 w-full relative">
              <div className="relative shrink-0 flex items-center justify-center w-full lg:w-5/12">
                <span className="absolute -right-4 sm:-right-10 lg:-right-16 text-7xl sm:text-8xl md:text-[11rem] lg:text-[13rem] font-extrabold text-[#b4c5ff] dark:text-blue-950/60 opacity-30 pointer-events-none z-0 select-none tracking-tighter leading-none -top-10 sm:-top-16">
                  06
                </span>
                <div
                  className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-92 group overflow-hidden z-10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <Image
                    alt="ERP Software"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="/services/erp-banner.webp"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>

              <div className="w-full lg:w-7/12 text-center lg:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Factory className="size-3.5" /> Enterprise Resource Planning
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 leading-tight">
                  Unified Operations for Manufacturing & Distribution
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                  Connect business processes with robust ERP solutions designed around your operational requirements. Eliminate departmental silos, streamline inventory cycles, and manage production with complete live visibility.
                </p>

                {/* 4 Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Database className="size-4 text-blue-600 shrink-0" />
                      Inventory & Purchase Tracking
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Real-time inventory levels, reorder threshold alerts, and supplier purchase order automation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <Factory className="size-4 text-blue-600 shrink-0" />
                      Shop Floor Production
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Bill of Materials (BOM), assembly line job card routing, and machine utilization tracking.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <ShieldCheck className="size-4 text-blue-600 shrink-0" />
                      GST Invoicing & Accounting
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Seamless GST-compliant tax invoicing, multi-ledger accounting, and vendor reconciliation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <div className="font-bold text-foreground text-sm flex items-center gap-2 mb-1">
                      <BarChart3 className="size-4 text-blue-600 shrink-0" />
                      Executive KPI Dashboards
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Instant financial visibility into profit margins, inventory holding costs, and fulfillment timelines.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/services/erp"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider shadow-md hover:scale-105"
                  >
                    Explore ERP Solutions <ChevronRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                  >
                    Discuss Your Project
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4">How We Work</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven methodology to ensure successful project delivery from concept to deployment.
            </p>
          </div>
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border/50 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-card p-6 rounded-2xl border border-border/70 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 border-4 border-background">
                  1
                </div>
                <h4 className="text-xl font-bold text-foreground text-center mb-2 mt-4 md:mt-6">Consultation</h4>
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                  Deep dive into your business needs, challenges, and technical requirements.
                </p>
              </div>
              {/* Step 2 */}
              <div className="bg-card p-6 rounded-2xl border border-border/70 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mb-4 mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 border-4 border-background">
                  2
                </div>
                <h4 className="text-xl font-bold text-foreground text-center mb-2 mt-4 md:mt-6">Strategy</h4>
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                  Architecting scalable solutions and defining a clear technical roadmap.
                </p>
              </div>
              {/* Step 3 */}
              <div className="bg-card p-6 rounded-2xl border border-border/70 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mb-4 mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 border-4 border-background">
                  3
                </div>
                <h4 className="text-xl font-bold text-foreground text-center mb-2 mt-4 md:mt-6">Implementation</h4>
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                  Agile development phases with rigorous quality assurance testing.
                </p>
              </div>
              {/* Step 4 */}
              <div className="bg-card p-6 rounded-2xl border border-border/70 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mb-4 mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 border-4 border-background">
                  4
                </div>
                <h4 className="text-xl font-bold text-foreground text-center mb-2 mt-4 md:mt-6">Support</h4>
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                  Ongoing maintenance, security updates, and performance optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action Section (PDF Section 6) */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:24px_24px] opacity-25"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary-foreground mb-6 leading-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover how the right technology can simplify your operations, improve productivity, and help your business grow. Let&apos;s build a solution tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact-us" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-background text-foreground hover:bg-muted px-8 py-4 rounded-full text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer hover:scale-105">
                Discuss Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="#services" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 px-8 py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
                Explore Our Services
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
