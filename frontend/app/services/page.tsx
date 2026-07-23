"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Clocks Component
const GlobalPresenceClocks = () => {
    const [indiaTime, setIndiaTime] = useState("");
    const [uaeTime, setUaeTime] = useState("");

    useEffect(() => {
        const updateClocks = () => {
            const now = new Date();
            const india = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
            const uae = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }));

            const format = (date: Date) =>
                date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');

            setIndiaTime(format(india));
            setUaeTime(format(uae));
        };

        updateClocks();
        const interval = setInterval(updateClocks, 1000);
        return () => clearInterval(interval);
    }, []);

    // Hydration fix - return null or placeholders initially if needed, but since it's client component we can just render
    return (
        <div className="relative max-w-4xl mx-auto">
            {/* Vertical Separator (Desktop Only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
                {/* India Section */}
                <div className="flex flex-col items-center text-center px-4 sm:px-8 py-4">
                    <div className="text-5xl sm:text-7xl md:text-8xl text-foreground font-extrabold tracking-tight mb-4 min-h-[72px] sm:min-h-[96px]">
                        {indiaTime || "00:00"}
                    </div>
                    
<h3 className="text-3xl text-foreground font-bold mb-2 flex items-center justify-center">
                        <img src="https://flagcdn.com/w40/in.png" alt="India Flag" className="w-8 h-auto mr-3" />
                        India
</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium uppercase tracking-widest text-xs sm:text-sm">Mumbai</span>
                    </div>
                    <div className="mt-4 text-xs sm:text-sm text-muted-foreground font-semibold uppercase tracking-widest">
                        IST (UTC+5:30)
                    </div>
                </div>

                {/* UAE Section */}
                <div className="flex flex-col items-center text-center px-4 sm:px-8 py-4">
                    <div className="text-5xl sm:text-7xl md:text-8xl text-foreground font-extrabold tracking-tight mb-4 min-h-[72px] sm:min-h-[96px]">
                        {uaeTime || "00:00"}
                    </div>
                    <h3 className="text-3xl text-foreground font-bold mb-2 flex items-center justify-center">
                        <img src="https://flagcdn.com/w40/ae.png" alt="UAE Flag" className="w-8 h-auto mr-3" />
                        UAE
</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium uppercase tracking-widest text-xs sm:text-sm">Dubai</span>
                    </div>
                    <div className="mt-4 text-xs sm:text-sm text-muted-foreground font-semibold uppercase tracking-widest">
                        GST (UTC+4:00)
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function ServicesPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-20 sm:pt-24 pb-20 sm:pb-32 overflow-hidden">
                <div className="absolute inset-0 w-full h-full z-0">
                    <img
                        alt="High-tech professional IT background"
                        className="w-full h-full object-cover opacity-10"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdepPcUqWQb-AvSbx-mPzI5Crwpvmi02OxS4GFzCKt-h2KiecG9Rys_cgYTOJTyjLYS7llW3Q8vb9irsUttkpKJoKBQvydmhMh7a9-RsZ8FIlFNlrcXMAvF4Q5W9DVPCu3zVA7g_yvrp67UA3nBclcMDbQDW_QAPOhd-Y5TEF8DOEx4q5csZaAVW5TjhXtHmRiMu-GbkmD34QiOflsK4kIODgdYtodC87c_6g1eBst_xOQPkYq_Rx2fQ"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Expert Solutions</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl text-foreground mb-6 max-w-4xl mx-auto font-bold tracking-tight">
                        Our Specialized IT Services
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Cutting-edge solutions to scale your business operations. We build robust, secure, and scalable technology tailored to your enterprise needs.
                    </p>
                    <div className="flex justify-center gap-4">
                        {/* Explore Offerings button removed as requested */}
                    </div>
                </div>
            </section>

            {/* Global Presence Section */}
            <section className="py-20 bg-background border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Global Presence</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Strategically located to serve our enterprise clients across the globe.
                        </p>
                    </div>
                    <GlobalPresenceClocks />
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-32 bg-muted/30 border-y border-border/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Core Capabilities</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive technology services designed to drive operational excellence and sustainable growth.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-8 py-12">
                        {/* Row 1: CRM Solutions */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full mb-20 md:-left-24 relative">
                            <div className="relative shrink-0">
                                <span className="absolute -left-24 md:-left-48 text-8xl md:text-[20rem] font-extrabold text-[#b4c5ff] opacity-30 pointer-events-none z-0 select-none tracking-tighter -top-40 leading-none">01</span>
                                <div className="relative w-64 h-72 md:w-72 md:h-80 group overflow-hidden z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                    <img alt="CRM Solutions" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="/services/crm.webp" />
                                </div>
                            </div>
                            <div className="max-w-md text-center md:text-left relative z-10">
                                <h3 className="text-3xl font-bold text-foreground mb-4">CRM Solutions</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Streamline your customer relationships and sales pipelines. Our CRM solutions empower your team with real-time data, automated workflows, and comprehensive insights for better decision making.
                                </p>
                                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                    <Link href="/services/crm" className="inline-block bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider">Learn More</Link>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Web Development */}
                        <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-20 w-full mb-20 relative">
                            <div className="relative shrink-0">
                                <span className="absolute -right-24 md:-right-48 text-8xl md:text-[20rem] font-extrabold text-[#b4c5ff] opacity-30 pointer-events-none z-0 select-none tracking-tighter -top-40 leading-none">02</span>
                                <div className="relative w-64 h-72 md:w-72 md:h-80 group overflow-hidden z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                    <img alt="Web Development" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="/services/web-dev.webp" />
                                </div>
                            </div>
                            <div className="max-w-md text-center md:text-right relative z-10">
                                <h3 className="text-3xl font-bold text-foreground mb-4">Web Development</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Building responsive, high-performance web applications that deliver exceptional user experiences across all devices. We focus on scalability and modern architecture to ensure your business stays ahead in a competitive digital landscape.
                                </p>
                                <Link href="/services/web-development" className="inline-block bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider">Learn More</Link>
                            </div>
                        </div>

                        {/* Row 3: Mobile Apps */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full mb-20 relative">
                            <div className="relative shrink-0">
                                <span className="absolute -left-24 md:-left-48 text-8xl md:text-[20rem] font-extrabold text-[#b4c5ff] opacity-30 pointer-events-none z-0 select-none tracking-tighter -top-40 leading-none">03</span>
                                <div className="relative w-64 h-72 md:w-72 md:h-80 group overflow-hidden z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                    <img alt="Mobile Apps" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="/services/mobile-app.webp" />
                                </div>
                            </div>
                            <div className="max-w-md text-center md:text-left relative z-10">
                                <h3 className="text-3xl font-bold text-foreground mb-4">Mobile Apps</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Native and cross-platform mobile solutions that keep your business connected with customers on the go. We build intuitive interfaces and robust backends that provide seamless performance on every handheld device.
                                </p>
                                <Link href="/services/mobile-app" className="inline-block bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider">Learn More</Link>
                            </div>
                        </div>

                        {/* Row 4: AI Chatbots */}
                        <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-20 w-full mb-20 relative">
                            <div className="relative shrink-0">
                                <span className="absolute -right-24 md:-right-48 text-8xl md:text-[20rem] font-extrabold text-[#b4c5ff] opacity-30 pointer-events-none z-0 select-none tracking-tighter -top-40 leading-none">04</span>
                                <div className="relative w-64 h-72 md:w-72 md:h-80 group overflow-hidden z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                    <img alt="AI Chatbots" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpOfD-HUh1A0TcZXeh7hxBmcwDvb6q-JukYYCzkg_XDOtcIHUbam8aFwJ-clUcayjSbpIZU9QvV6c1S0RUdhqxQp686QxgLvyM9X3655zZPh-giNp8Ch80KqcRGaKs59sBt1lLipvNg7KrTyRAjKqnroPOXtKF2zs_tTwuT9Oftw__zvas8ZEmtEFC0JqQwfPeI2mufjgY-KFr6Z3f_V0xXVGSABJHRtVwLTvW42XdtMV2xDe-J47DQQ" />
                                </div>
                            </div>
                            <div className="max-w-md text-center md:text-right relative z-10">
                                <h3 className="text-3xl font-bold text-foreground mb-4">AI Chatbots</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Intelligent conversational agents that automate customer support and enhance user engagement 24/7. Our AI solutions learn from interactions to provide personalized experiences and reduce operational overhead.
                                </p>
                                <Link href="/services/ai-chatbots" className="inline-block bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider">Learn More</Link>
                            </div>
                        </div>

                        {/* Row 5: Business Automation */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full mb-20 relative">
                            <div className="relative shrink-0">
                                <span className="absolute -left-24 md:-left-48 text-8xl md:text-[20rem] font-extrabold text-[#b4c5ff] opacity-30 pointer-events-none z-0 select-none tracking-tighter -top-40 leading-none">05</span>
                                <div className="relative w-64 h-72 md:w-72 md:h-80 group overflow-hidden z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                    <img alt="Business Automation" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="/services/business-automation.webp" />
                                </div>
                            </div>
                            <div className="max-w-md text-center md:text-left relative z-10">
                                <h3 className="text-3xl font-bold text-foreground mb-4">Business Automation</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Optimizing workflows and reducing manual tasks through smart automation technology tailored to your needs. We identify bottlenecks and implement efficient systems that free up your team for higher-value work.
                                </p>
                                <Link href="/services/business-automation" className="inline-block bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider">Learn More</Link>
                            </div>
                        </div>

                        {/* Row 6: ERP Systems */}
                        <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-20 w-full relative">
                            <div className="relative shrink-0">
                                <span className="absolute -right-24 md:-right-48 text-8xl md:text-[20rem] font-extrabold text-[#b4c5ff] opacity-30 pointer-events-none z-0 select-none tracking-tighter -top-40 leading-none">06</span>
                                <div className="relative w-64 h-72 md:w-72 md:h-80 group overflow-hidden z-10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                    <img alt="ERP Systems" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="/services/erp.avif" />
                                </div>
                            </div>
                            <div className="max-w-md text-center md:text-right relative z-10">
                                <h3 className="text-3xl font-bold text-foreground mb-4">ERP Systems</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Integrate core business processes with centralized management systems designed for efficiency and scalability. Our ERP solutions optimize resources and synchronize your entire operation.
                                </p>
                                <Link href="/services/erp" className="inline-block bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all uppercase tracking-wider">Learn More</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-32 bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How We Work</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A proven methodology to ensure successful project delivery from concept to deployment.
                        </p>
                    </div>
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border/50 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm relative">
                                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 border-4 border-background">1</div>
                                <h4 className="text-2xl font-bold text-foreground text-center mb-2 mt-4 md:mt-6">Consultation</h4>
                                <p className="text-sm text-muted-foreground text-center">
                                    Deep dive into your business needs, challenges, and technical requirements.
                                </p>
                            </div>
                            {/* Step 2 */}
                            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm relative">
                                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mb-4 mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 border-4 border-background">2</div>
                                <h4 className="text-2xl font-bold text-foreground text-center mb-2 mt-4 md:mt-6">Strategy</h4>
                                <p className="text-sm text-muted-foreground text-center">
                                    Architecting scalable solutions and defining a clear technical roadmap.
                                </p>
                            </div>
                            {/* Step 3 */}
                            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm relative">
                                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mb-4 mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 border-4 border-background">3</div>
                                <h4 className="text-2xl font-bold text-foreground text-center mb-2 mt-4 md:mt-6">Implementation</h4>
                                <p className="text-sm text-muted-foreground text-center">
                                    Agile development phases with rigorous quality assurance testing.
                                </p>
                            </div>
                            {/* Step 4 */}
                            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm relative">
                                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mb-4 mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 border-4 border-background">4</div>
                                <h4 className="text-2xl font-bold text-foreground text-center mb-2 mt-4 md:mt-6">Support</h4>
                                <p className="text-sm text-muted-foreground text-center">
                                    Ongoing maintenance, security updates, and performance optimization.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-primary-foreground mb-6">Ready to get started?</h2>
                    <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                        Transform your business operations with our enterprise-grade IT solutions. Let's build the future together.
                    </p>
                    <button className="bg-background text-foreground hover:bg-muted px-8 py-4 rounded-full text-sm font-semibold shadow-lg transition-all flex items-center gap-2 mx-auto group">
                        Get Free Quote
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>
        </>
    );
}
