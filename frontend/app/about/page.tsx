"use client"
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play, Briefcase, Target, ShieldCheck, Asterisk, Trophy, KeyRound, Leaf, Rocket, Eye, CheckCircle2, Globe as GlobeIcon, ArrowRight, Check, Users, Mail } from "lucide-react";
import { getDynamicTeamMembers, getFullImageUrl, TeamMember } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";

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
        date.getHours().toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0");

      setIndiaTime(format(india));
      setUaeTime(format(uae));
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical Separator (Desktop Only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
        {/* India Section */}
        <div className="flex flex-col items-center text-center px-4 sm:px-8 py-4">
          <div className="text-5xl sm:text-7xl md:text-8xl text-slate-900 dark:text-white font-extrabold tracking-tight mb-4 min-h-[72px] sm:min-h-[96px]">
            {indiaTime || "00:00"}
          </div>

          <h3 className="text-2xl sm:text-3xl text-slate-900 dark:text-white font-bold mb-2 flex items-center justify-center">
            <img src="https://flagcdn.com/w40/in.png" alt="India Flag" className="w-8 h-auto mr-3 rounded-sm shadow-sm" />
            India
          </h3>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="font-medium uppercase tracking-widest text-xs sm:text-sm">Pune</span>
          </div>
          <div className="mt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">
            IST (UTC+5:30)
          </div>
        </div>

        {/* UAE Section */}
        <div className="flex flex-col items-center text-center px-4 sm:px-8 py-4">
          <div className="text-5xl sm:text-7xl md:text-8xl text-slate-900 dark:text-white font-extrabold tracking-tight mb-4 min-h-[72px] sm:min-h-[96px]">
            {uaeTime || "00:00"}
          </div>
          <h3 className="text-2xl sm:text-3xl text-slate-900 dark:text-white font-bold mb-2 flex items-center justify-center">
            <Image src="https://flagcdn.com/w40/ae.png" alt="UAE Flag" width={32} height={24} className="w-8 h-auto mr-3 rounded-sm shadow-sm" />
            UAE
          </h3>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="font-medium uppercase tracking-widest text-xs sm:text-sm">Dubai</span>
          </div>
          <div className="mt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">
            GST (UTC+4:00)
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Member Social Icons
const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function AboutPage() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    let isMounted = true;
    getDynamicTeamMembers()
      .then((res) => {
        if (isMounted) {
          setTeamMembers(res || []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTeamMembers([]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Indux Technology",
    "url": "https://induxtechnology.com",
    "logo": "https://induxtechnology.com/induxtechnologylogo_white.webp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kharadi, Pune",
      "addressRegion": "MH",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.linkedin.com/company/induxtechnology",
      "https://www.facebook.com/885831577953764/",
      "https://x.com/induxtechnology"
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans overflow-hidden">
      <script
        type="application/ld+json"
        id="about-org-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Hero Section (Blue Background) */}
      <section className="relative pt-20 md:pt-24 pb-44 md:pb-48 px-6 bg-blue-600">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-1/4 text-white/20">
          <Trophy size={50} />
        </div>
        <div className="absolute top-32 right-1/4 text-white/20">
          <KeyRound size={58} />
        </div>
        <div className="absolute top-40 right-1/3 w-4 h-4 rounded-full border-2 border-white/20" />
        <div className="absolute top-24 left-1/3 w-3 h-3 rounded-full bg-white/20" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            A Pune software team that builds what your business needs
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto">
            Meet the Pune team behind Indux CRM, Jemsoft and InduxERP. We build practical software for growing businesses.
          </motion.p>
        </motion.div>
      </section>

 {/* Overlapping Image Grid */}
      <section className="relative px-6 -mt-32 md:-mt-36 z-20 pb-4 sm:pb-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              "/images/unsplash/img-419ff117.webp",
              "/images/unsplash/img-0f92163a.webp",
              "/images/unsplash/img-f5258efe.webp",
              "/images/unsplash/img-29d85ac4.webp"
            ].map((imgSrc, index) => (
              <motion.div
                key={imgSrc}
                variants={fadeUp}
 className={`relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl ${index % 2 !== 0 ? 'md:mt-6' : ''}`}
              >
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
 <Image
 src={imgSrc}
                    alt={`Indux Team & Workspace ${index + 1}`}
                    fill
 className="object-cover transition-transform duration-500"
                    unoptimized
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Indux Group Stories (Centered Title, Two-Column Text) */}
      <section className="px-6 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-8 md:mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900 dark:text-white">
              Indux Group Journey
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6 md:gap-12 text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-left"
          >
            <motion.p variants={fadeUp}>
              Indux Technology was founded in 2021 in Pune by Laxman Jadhav, a full-stack developer who saw how many growing businesses were held back by spreadsheets and disconnected tools.
            </motion.p>
            <motion.p variants={fadeUp}>
              Today our team of 25+ developers, designers and business analysts builds CRM, ERP, HRMS and custom applications for clients across manufacturing, insurance, services, retail, and real estate.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section (Overlapping Cards) */}
      <section className="px-6 py-16 md:py-20 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
 {/* Left: Image with floating card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
<div className="relative aspect-[3/4] md:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
              <img
                src="/owner.webp"
                alt="Founder"
                width="800"
                height="600"
                loading="lazy"
 className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-2 md:-right-8 bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-xl max-w-[260px] border border-slate-200/60 dark:border-slate-700/60">
              <p className="font-bold text-base md:text-lg text-slate-900 dark:text-white leading-tight">
                "Making an impact, together"
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium text-sm">— Laxman Jadhav</p>
            </div>
          </motion.div>

          {/* Right: Text and Quote */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:pl-8 pt-6 md:pt-0"
          >
            <h2 className="text-2xl md:text-4xl font-bold leading-tight text-slate-900 dark:text-white mb-4">
              We empower small business owners
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We believe in the power of technology to transform ideas into reality. Our dedication to our clients goes beyond code; it's about building lasting partnerships that drive real-world impact.
            </p>
            <div className="pl-5 border-l-4 border-blue-600 py-1.5">
              <p className="text-lg md:text-xl font-medium italic text-slate-800 dark:text-slate-300">
                "Move different if you want different. Old keys can't Unlock new Door."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== DYNAMIC OUR TEAM SECTION ===== */}
      {teamMembers.length > 0 && (
      <section className="px-6 py-20 md:py-24 bg-slate-50/80 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/70 mb-4"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Meet The Builders</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
              The Minds Behind Indux Technology
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              A collective of seasoned engineers, enterprise architects, and designers committed to transforming complex business problems into elegant, scalable software.
            </motion.p>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => {
              const fullImg = getFullImageUrl(member.image);
              return (
                <motion.div
                  key={member._id || member.name + index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Member Photo */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={fullImg}
                      alt={member.name}
                      fill
                      unoptimized={fullImg.startsWith("http://localhost") || fullImg.startsWith("http")}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient Overlay for photo bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Department Badge */}
                    {member.department && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm border border-white/20">
                          {member.department}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex flex-col flex-grow p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                      {member.role}
                    </p>

                    {member.bio && (
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Social Links Footer */}
                    {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
                      <div className="mt-auto pt-4 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80">
                        {member.socialLinks.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on LinkedIn`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            <LinkedInIcon className="w-4 h-4" />
                          </a>
                        )}
                        {member.socialLinks.github && (
                          <a
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on GitHub`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <GitHubIcon className="w-4 h-4" />
                          </a>
                        )}
                        {member.socialLinks.twitter && (
                          <a
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on X/Twitter`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            <TwitterIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.socialLinks.email && (
                          <a
                            href={`mailto:${member.socialLinks.email}`}
                            aria-label={`Email ${member.name}`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors ml-auto"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Mission Section */}
      <section className="px-6 py-16 md:py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">

 {/* Left: Image Collage for Mission */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[340px] md:h-[420px] w-full"
          >
 {/* Image 1 (Back/Top Left) */}
            <div className="absolute top-0 left-0 w-[65%] h-[72%] rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-white dark:border-slate-950">
 <Image src="/images/unsplash/img-9799f8ae.webp" alt="Team Collaboration at Indux Technology" fill className="object-cover" unoptimized />
            </div>
 {/* Image 2 (Front/Bottom Right) */}
            <div className="absolute bottom-0 right-0 w-[65%] h-[72%] rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-white dark:border-slate-950">
 <Image src="/images/unsplash/img-b27e33a3.webp" alt="Mission Execution at Indux Technology" fill className="object-cover" unoptimized />
            </div>
            {/* Decorative dot pattern */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:12px_12px] opacity-30 z-0"></div>
          </motion.div>

          {/* Right: Mission Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.div variants={fadeUp} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl shadow-inner">
                  <Rocket size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm md:text-base">
                Our mission is to empower businesses globally with scalable, innovative, and reliable technology solutions that simplify operations, improve productivity, and accelerate digital transformation. We help organizations turn ideas into practical digital solutions through custom software development, CRM and ERP systems, AI-powered automation, and web and mobile applications tailored to their unique business needs.
              </p>
              <ul className="space-y-2.5">
                {['Client-Centric Agile Development', 'Future-Ready Tech Integrations', 'Uncompromising Quality & Security'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base">
                    <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold text-sm md:text-base leading-relaxed">
                Simple. Reliable. Built around you. That’s how we work.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="px-6 py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* Left: Vision Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col order-2 lg:order-1"
          >
            <motion.div variants={fadeUp} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-inner">
                  <Eye size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm md:text-base">
                To become a globally recognized IT leader by delivering innovative, scalable, and future-ready digital solutions. At Indux Technology, we aim to empower businesses through modern technology, AI-driven innovation, and reliable software solutions that enhance efficiency, encourage growth, and create lasting value.
              </p>
              <ul className="space-y-2.5">
                {['Global Reach & Impact', 'Continuous Innovation Hub', 'Sustainable & Ethical Tech'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base">
                    <CheckCircle2 size={20} className="text-indigo-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold text-sm md:text-base leading-relaxed">
                Build Once. Scale Infinitely.
              </p>
            </motion.div>
          </motion.div>

 {/* Right: Image Collage for Vision */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[340px] md:h-[420px] w-full order-1 lg:order-2"
          >
 {/* Image 1 (Back/Top Right) */}
            <div className="absolute top-0 right-0 w-[65%] h-[72%] rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-slate-50 dark:border-slate-900">
 <Image src="/images/unsplash/img-5b65630e.webp" alt="Innovation" fill className="object-cover" unoptimized />
            </div>
 {/* Image 2 (Front/Bottom Left) */}
            <div className="absolute bottom-0 left-0 w-[65%] h-[72%] rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-slate-50 dark:border-slate-900">
 <Image src="/images/unsplash/img-0ffac912.webp" alt="Global Reach" fill className="object-cover" unoptimized />
            </div>
            {/* Decorative dot pattern */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[radial-gradient(#6366f1_2px,transparent_2px)] [background-size:12px_12px] opacity-30 z-0"></div>
          </motion.div>

        </div>
      </section>

      {/* Our Approach & Values Section */}
      <section className="relative px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Our Approach */}
          <div className="text-center mb-10 md:mb-12">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3"
            >
              Our Approach
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              How we partner with you to turn business goals into working, reliable software.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mb-12 md:mb-14"
          >
            {[
              {
                title: "Understand the business first",
                desc: "We map your process before we write code, ensuring software matches how you work.",
                icon: Briefcase,
              },
              {
                title: "Build in small steps",
                desc: "You see progress every sprint and can change direction early with no surprises.",
                icon: Target,
              },
              {
                title: "Stay after launch",
                desc: "Training, support and improvements are part of our ongoing long-term relationship.",
                icon: ShieldCheck,
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-7 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Our Values */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-6 sm:p-8 md:p-10 text-center"
          >
            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-xs sm:text-sm">
              Our Values
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 mb-6">
              Honest estimates. Clear communication. Software that gets used.
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto text-left">
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Honest estimates</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Realistic timelines and transparent scope before we start.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Clear communication</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">One direct point of contact with weekly demos and updates.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Software that gets used</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Built around actual staff workflows, not theoretical checklists.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Global Reach Section */}
      <section className="px-6 py-18 md:py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.div variants={fadeUp} className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold text-xs sm:text-sm mb-5 shadow-sm">
                <GlobeIcon size={14} />
                Global Presence
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-5">
                Trusted by Businesses Across the Globe
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 md:mb-10 leading-relaxed">
                Our digital solutions transcend borders. From dynamic startups in Silicon Valley to established enterprises in Asia, we build scalable, future-ready technology that connects the world and drives international growth.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col border-l-4 border-blue-500 pl-4">
                  <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">12+</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Countries</span>
                </div>
                <div className="flex flex-col border-l-4 border-indigo-500 pl-4">
                  <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">24/7</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Support</span>
                </div>
                <div className="flex flex-col border-l-4 border-emerald-500 pl-4">
                  <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">99%</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Uptime</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Globe Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-[440px] aspect-square mx-auto flex items-center justify-center"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-4 rounded-full bg-blue-500/10 dark:bg-blue-600/20 blur-3xl pointer-events-none -z-10" />

            <div className="w-full h-full relative flex items-center justify-center">
              <Globe />
            </div>
            {/* Dynamic floating location pills matching Indux offices */}
            <div className="absolute top-2 left-2 sm:left-4 z-10 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-md backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pune, India</span>
              <span className="text-[10px] text-slate-400 font-normal">HQ</span>
            </div>

            <div className="absolute bottom-4 right-2 sm:right-4 z-10 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-md backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Dubai, UAE</span>
              <span className="text-[10px] text-slate-400 font-normal">Hub</span>
            </div>

          </motion.div>

        </div>
      </section>

      {/* Our Global Presence Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Our Global Presence
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Strategically located to serve our enterprise clients across the globe.
            </p>
          </div>
          <GlobalPresenceClocks />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-18 md:py-24 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Want to talk about your project?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-8 max-w-xl">
            Let's discuss how we can build custom CRM, ERP, or web software around how your business works.
          </p>
          <Link href="/contact-us">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-full text-sm sm:text-base transition-all hover:scale-105 shadow-xl">
              Book a free consultation
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
