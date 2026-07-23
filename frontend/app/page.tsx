"use client";

import Image from "next/image";
import {
  ArrowRight,
  Play,
  Trophy,
  Check,
  Users,
  ClipboardCheck,
  LineChart,
  Code2,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { getBlogs, submitLead, Blog } from "@/lib/api";
import { motion, useScroll, useTransform } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { Marquee } from "@/components/ui/marquee";
import { ConfettiButton } from "@/components/ui/confetti";
import { ContactForm } from "@/components/ContactForm";
import { GetQuoteModal } from "@/components/GetQuoteModal";

// Review data
const reviews = [
  { name: "Paras Bora", rating: 5, body: "Laxman is very good at his work. I use the crm software he has developed for us. Reaping good benefits and is cost effective as well", img: "https://i.pravatar.cc/150?u=10" },
  { name: "Subhangi Solunke", rating: 5, body: "Great experience with Indux Technology. They understood my needs and delivered perfectly. Professional team with smooth collaboration.", img: "https://i.pravatar.cc/150?u=20" },
  { name: "Nikhil Sharma Eventpreneur", rating: 5, body: "Laxman has great knowledge about his industry and has been super productive with this delivery. Wishing you many success ahead.", img: "https://i.pravatar.cc/150?u=30" },
  { name: "Aditya Chakre", rating: 5, body: "Just wanted to share my experience with Indux Technology. I used them for a CRM project and it was a really good experience. The project turned out great!", img: "https://i.pravatar.cc/150?u=40" },
  { name: "Aditya Shastri1817", rating: 5, body: "Indux Technology played a key role in our digital transformation journey. From strategy to execution, they provided end-to-end solutions including development and marketing.", img: "https://i.pravatar.cc/150?u=50" },
  { name: "Satish Mundalik", rating: 5, body: "Laxman is a master of CRM — creating strong connections, building trust, and maintaining lasting relationships. He believes every contact is valuable and every follow-up creates new opportunities.", img: "https://i.pravatar.cc/150?u=60" },
  { name: "Priyanka V Memories Worldwide", rating: 5, body: "Give very genuine and correct solutions of your problems thru their CRM software", img: "https://i.pravatar.cc/150?u=70" },
  { name: "atif pervez", rating: 5, body: "Indux Technology delivered a reliable IT solution with a professional and responsive team. A smooth experience and a dependable development partner.", img: "https://i.pravatar.cc/150?u=80" },
];
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  rating,
  body,
}: {
  img: string;
  name: string;
  rating: number;
  body: string;
}) => {
  const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  const colors = ["bg-red-500", "bg-blue-600", "bg-green-600", "bg-yellow-600", "bg-purple-600", "bg-pink-600", "bg-indigo-600", "bg-teal-600", "bg-orange-600"];
  const bgColor = colors[name.length % colors.length];

  return (
    <figure
      className={
        "relative w-[280px] xs:w-[310px] sm:w-[350px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border p-4 sm:p-6 border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 transition-colors"
      }
    >
      <div className="flex flex-row items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${bgColor}`}>
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <figcaption className="text-base font-bold dark:text-white truncate">
            {name}
          </figcaption>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-slate-200 dark:text-slate-700"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
      <blockquote className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {body}
      </blockquote>
    </figure>
  );
};

const fallbackBlogs = [
  {
    _id: "fallback-1",
    title: "The Ultimate Guide to Cloud Migration Strategy in 2026",
    category: "Cloud Computing",
    shortDescription:
      "Discover how moving your legacy systems to the cloud can improve scalability, reduce costs, and accelerate innovation.",
    featuredImage:
      "/images/unsplash/img-62ae3366.webp",
    slug: "#",
  },
  {
    _id: "fallback-2",
    title: "Top 5 Cybersecurity Threats Every Business Must Know",
    category: "Cybersecurity",
    shortDescription:
      "A comprehensive look at the emerging cyber threats in the modern digital landscape and how to protect your enterprise data.",
    featuredImage:
      "/images/unsplash/img-ca777973.webp",
    slug: "#",
  },
  {
    _id: "fallback-3",
    title: "How AI is Revolutionizing Custom Enterprise Software",
    category: "AI & Machine Learning",
    shortDescription:
      "Learn how integrating machine learning and AI into your business applications can automate workflows and drive unprecedented growth.",
    featuredImage:
      "/images/unsplash/img-fbc3450c.webp",
    slug: "#",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [scrollRange, setScrollRange] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Measure exact horizontal overflow width dynamically
  useEffect(() => {
    const calculateRange = () => {
      if (trackRef.current) {
        // Total track width minus screen width = exact distance to scroll
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
      }
      setViewportHeight(window.innerHeight);
    };

    calculateRange();
    window.addEventListener("resize", calculateRange);
    return () => window.removeEventListener("resize", calculateRange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Move exact pixel distance based on vertical scroll progress
  const xTransform = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    getBlogs()
      .then((data) => {
        const published = data.filter((b) => b.status === "Published");
        setBlogs(published.slice(0, 3));
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
      })
      .finally(() => setBlogsLoading(false));
  }, []);

  const displayedBlogs = blogs.length > 0 ? blogs : fallbackBlogs;

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24 lg:pt-8 lg:pb-32">
          {/* Subtle dot pattern background */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
              {/* Left Side: Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-4 sm:gap-6 text-left max-w-xl mx-auto lg:mx-0"
              >
                <div className="inline-flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400 text-base sm:text-lg w-max">
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 -ml-1"></span>
                  </div>
                  Elevate your work with us
                </div>

                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] sm:leading-[1.1]">
                  Build{" "}
                  <LineShadowText className="italic" shadowColor="#2563eb">
                    Smarter.
                  </LineShadowText>
                  <br />
                  Scale Faster.
                </h1>

                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mt-1 sm:mt-2 max-w-md">
                  Custom IT Solutions That Power Your Business.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
                  <GetQuoteModal>
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
                      Get Free Quote <ArrowRight className="w-4 h-4" />
                    </Button>
                  </GetQuoteModal>
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 underline underline-offset-4 decoration-2 decoration-slate-300 dark:decoration-slate-700 hover:decoration-slate-800 dark:hover:decoration-slate-500 transition-all cursor-pointer py-2 sm:py-0"
                  >
                    Our Services
                  </Link>
                </div>
              </motion.div>

              {/* Right Side: Bento Image Grid (Custom Layout) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center max-w-lg mx-auto lg:max-w-none"
              >
                {/* Floating Rotating Text Badge */}
                <div className="absolute -left-2 sm:left-0 lg:-left-6 bottom-6 sm:bottom-1/4 z-20 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl dark:shadow-none dark:border dark:border-slate-800">
                  {/* Rotating Text SVG */}
                  <div className="absolute inset-1.5 sm:inset-2 animate-[spin_8s_linear_infinite]">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-blue-600 overflow-visible"
                    >
                      <path
                        id="circlePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                      />
                      <text
                        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em]"
                        fill="currentColor"
                      >
                        <textPath href="#circlePath" startOffset="0%">
                          • INDUX TECHNOLOGY • TOP RATED
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  {/* Center Icon */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {/* Floating Sparkles */}
                <div className="absolute right-2 bottom-4 sm:right-0 sm:bottom-10 z-20 text-blue-500 animate-pulse">
                  <Trophy className="w-8 h-8 sm:w-12 sm:h-12" fill="currentColor" />
                </div>

                <div className="grid grid-cols-12 grid-rows-12 gap-2.5 sm:gap-4 w-full h-full relative z-10 p-2 sm:p-6 md:p-8">
                  {/* Left Tall Image */}
                  <div className="col-span-5 row-span-10 row-start-2 bg-slate-300 rounded-2xl sm:rounded-[2rem] rounded-tl-xl overflow-hidden relative shadow-lg">
                    <Image
                      src="/images/unsplash/img-f787f12c.webp"
                      alt="Team working"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Right Top Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-2xl sm:rounded-[2rem] rounded-tr-xl overflow-hidden relative shadow-lg">
                    <Image
                      src="/images/unsplash/img-4dddf9a5.webp"
                      alt="Discussion"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Right Middle Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-xl sm:rounded-2xl overflow-hidden relative shadow-lg">
                    <Image
                      src="/images/unsplash/img-9040528a.webp"
                      alt="Meeting"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Right Bottom Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-2xl sm:rounded-[2rem] rounded-br-xl overflow-hidden relative shadow-lg">
                    <Image
                      src="/images/unsplash/img-931d0d20.webp"
                      alt="Collaboration"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
              {/* Left Side: Overlapping Images */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative h-[360px] sm:h-[480px] md:h-[600px] w-full max-w-lg mx-auto lg:max-w-none"
              >
                {/* Back Image (Tall) */}
                <div className="absolute top-0 left-0 w-3/4 h-[80%] sm:h-[85%] bg-slate-200 dark:bg-slate-800 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-md">
                  <Image
                    src="/images/unsplash/img-4dddf9a5.webp"
                    alt="Team Discussion"
                    fill
                    sizes="(max-width: 768px) 75vw, 35vw"
                    className="object-cover"
                  />
                </div>

                {/* Front Image (Square, bottom right) */}
                <div className="absolute bottom-0 right-0 w-[65%] h-[58%] sm:h-[60%] bg-slate-200 dark:bg-slate-800 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white dark:border-slate-950">
                  <Image
                    src="/images/unsplash/img-51707ed2.webp"
                    alt="IT Professional"
                    fill
                    sizes="(max-width: 768px) 65vw, 30vw"
                    className="object-cover"
                  />
                </div>

                {/* Floating Badge (Top Right) */}
                <div className="absolute top-4 right-0 sm:top-12 sm:-right-4 md:-right-6 bg-blue-700 rounded-2xl sm:rounded-3xl rounded-tr-md text-white p-4 sm:p-6 md:p-8 shadow-xl flex flex-col items-center justify-center min-w-[120px] sm:min-w-[160px] transform hover:-translate-y-2 transition-transform duration-500">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-1">
                    <NumberTicker value={7} className="text-white" />+
                  </h3>
                  <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-blue-100 text-center leading-relaxed">
                    Years
                    <br />
                    Of Experience
                  </p>
                </div>
              </motion.div>

              {/* Right Side: Text & Features */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col gap-4 sm:gap-6"
              >
                <div className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2">
                  COMPANY ABOUT
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                  One of the fastest way to gain{" "}
                  <span className="italic text-slate-600 dark:text-slate-400 font-serif">
                    business success
                  </span>
                </h2>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base mt-1 sm:mt-2 max-w-lg">
                  We empower businesses across all industries with cutting-edge
                  IT solutions. From startups to large enterprises, our goal is
                  to leverage the power of technology to help clients reach
                  their target efficiently.
                </p>

                <div className="mt-2">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 text-sm md:text-base">
                    Development Special Services:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-6">
                    {[
                      "Emergency Solutions Anytime",
                      "How to improve business",
                      "Affordable price upto 2 years",
                      "Reliable & Experienced Team",
                    ].map((item, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                        key={i}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={4}
                          />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <Link href="/contact-us" className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-full font-bold tracking-wider text-xs uppercase cursor-pointer transition-all shadow-lg shadow-blue-700/20 group w-full sm:w-auto">
                    Connect With Us{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Solid Bottom Banner */}
          <div className="bg-[#0f2e4a] dark:bg-slate-900 w-full py-10 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-4 md:divide-x divide-blue-800/40 dark:divide-slate-800"
              >
                {[
                  { num: 50, suffix: "+", label: "Technology Partners" },
                  { num: 200, suffix: "+", label: "Complete project" },
                  { num: 70, suffix: "+", label: "Team Members" },
                  { num: 350, suffix: "+", label: "Happy clients" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 md:px-6 lg:px-8 first:pl-0 last:pr-0"
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-[1.5px] border-blue-400/20 flex items-center justify-center bg-blue-800/10 shrink-0">
                      <Trophy
                        className="w-4 h-4 sm:w-6 sm:h-6 text-blue-300 opacity-80"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-0.5 sm:mb-1">
                        <NumberTicker value={stat.num} className="text-white" />
                        {stat.suffix}
                      </h3>
                      <p className="text-blue-100/70 font-medium text-[10px] sm:text-[11px] md:text-xs tracking-wider uppercase">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 bg-slate-50 dark:bg-slate-950">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 sm:mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  </div>
                  Our Services
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Accelerate Growth with Our{" "}
                  <span className="text-blue-600">IT Expertise</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-6 py-6 rounded-full font-semibold transition-all group shadow-sm cursor-pointer justify-center">
                  View All Services{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1: CRM */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-600 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2"
              >
                <div className="p-3 sm:p-4 h-48 sm:h-56 md:h-64">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/images/unsplash/img-3516b3f9.webp"
                      alt="CRM Solutions"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-2 sm:pt-4 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white mb-2 sm:mb-3 transition-colors">
                    Custom CRM
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-100 mb-6 transition-colors leading-relaxed">
                    Tailored Customer Relationship Management systems to
                    streamline sales, marketing, and support pipelines
                    seamlessly.
                  </p>
                  <div className="mt-auto flex items-center text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                    Learn more{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Manufacturing ERP */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-600 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2"
              >
                <div className="p-6 sm:p-8 pb-2 sm:pb-4 flex flex-col flex-grow order-2 md:order-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white mb-2 sm:mb-3 transition-colors">
                    Manufacturing ERP
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-100 mb-6 transition-colors leading-relaxed">
                    Robust Enterprise Resource Planning software designed to
                    optimize supply chains and inventory management.
                  </p>
                  <div className="mt-auto flex items-center text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                    Learn more{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="p-3 sm:p-4 h-48 sm:h-56 md:h-64 order-1 md:order-2">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/images/unsplash/img-8afc3801.webp"
                      alt="Manufacturing ERP"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Sales Automation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-600 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2"
              >
                <div className="p-3 sm:p-4 h-48 sm:h-56 md:h-64">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/images/unsplash/img-1bd55875.webp"
                      alt="Sales Automation"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-2 sm:pt-4 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white mb-2 sm:mb-3 transition-colors">
                    Sales Automation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-100 mb-6 transition-colors leading-relaxed">
                    Intelligent automation tools to accelerate your sales cycle,
                    track performance, and boost revenue effortlessly.
                  </p>
                  <div className="mt-auto flex items-center text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                    Learn more{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION - STICKY SCROLL */}
        <section className="bg-slate-50/50 dark:bg-slate-950/50 relative overflow-visible">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-24 items-start relative">
              {/* Left Side: Sticky Content */}
              <div className="w-full lg:w-5/12 lg:sticky lg:top-32 z-10">
                <div className="inline-flex items-center justify-start gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-4 sm:mb-6">
                  <div className="flex gap-1">
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-500"></span>
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Why Choose Us
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
                  We don't just write code, <br className="hidden md:block" />
                  We build your{" "}
                  <LineShadowText
                    className="text-blue-600"
                    shadowColor="#2563eb"
                  >
                    business
                  </LineShadowText>
                </h2>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base md:text-lg max-w-md mb-8 sm:mb-10">
                  Partner with a technology team that focuses on scalable
                  architectures, agile delivery, and driving real results for
                  your company.
                </p>

                <Link href="/contact-us" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 sm:py-6 rounded-full font-bold tracking-wide text-xs sm:text-sm uppercase transition-all shadow-lg shadow-blue-600/20 group cursor-pointer w-full sm:w-auto">
                  Consult with our experts{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right Side: Scrollable Cards */}
              <div className="w-full lg:w-7/12 flex flex-col gap-6 sm:gap-8 lg:gap-12 lg:pb-32">
                {[
                  {
                    icon: Users,
                    title: "Expert Development Team",
                    desc: "Our team consists of highly skilled developers, problem solvers, and tech enthusiasts dedicated to building robust and innovative software solutions tailored to your unique business needs.",
                  },
                  {
                    icon: ClipboardCheck,
                    title: "Agile Delivery",
                    desc: "We follow strict agile methodologies to ensure rapid, transparent, and flawless deployment of your IT projects, meeting strict deadlines without ever compromising on quality.",
                  },
                  {
                    icon: Code2,
                    title: "Scalable Architecture",
                    desc: "We build scalable, future-proof code architectures that grow with your business, keeping you ahead of the competition and ready for future technological advancements.",
                  },
                  {
                    icon: LineChart,
                    title: "Transparent Process",
                    desc: "Get real-time insights into your project's progress with our transparent tracking and detailed reporting. We believe in open, honest communication at every step of development.",
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  const numStr = String(idx + 1).padStart(2, "0");
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-10 items-start w-full group"
                    >
                      {/* Huge Number */}
                      <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold text-blue-800 dark:text-blue-500 leading-none tracking-tighter sm:mt-4 w-16 sm:w-24 md:w-32 flex-shrink-0">
                        {numStr}
                      </div>

                      {/* Content Card (Strict Flat Border) */}
                      <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 border-[1.5px] border-slate-200 dark:border-slate-800 transition-all duration-500 flex-1 relative group-hover:border-blue-800/30 dark:group-hover:border-blue-500/30 w-full">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 dark:bg-blue-900/40 flex items-center justify-center mb-4 sm:mb-6">
                          <Icon
                            className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-blue-400"
                            strokeWidth={2}
                          />
                        </div>
                        <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 dark:text-white mb-2 sm:mb-3 md:mb-4 tracking-tight">
                          {feature.title}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* WORK PROCESS SECTION */}
        <section
          ref={containerRef}
          style={{
            height: scrollRange ? `${scrollRange + viewportHeight}px` : "180vh",
          }}
          className="relative bg-slate-50 dark:bg-slate-950"
        >
          <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden z-10 py-6 sm:py-0">
            <motion.div
              ref={trackRef}
              style={{ x: xTransform }}
              className="flex gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8"
            >
              {/* Intro Title Block */}
              <div className="w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] flex-shrink-0 flex flex-col justify-center pr-4 sm:pr-8 lg:pr-12">
                <div className="inline-flex items-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 dark:bg-slate-800"></span>
                  </div>
                  Our Work Process
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4 sm:mb-6">
                  Step-by-Step to <br /> Your{" "}
                  <span className="text-blue-600">Growth</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed">
                  We collaborate closely with clients to understand their
                  vision, goals, and target audience, conducting in-depth
                  research to craft tailored digital solutions.
                </p>
              </div>

              {/* Process Cards */}
              {[
                {
                  step: "01",
                  title: "Discover & Strategize",
                  desc: "We collaborate closely to understand your vision, target audience, and business goals, conducting in-depth research to craft a tailored digital roadmap.",
                },
                {
                  step: "02",
                  title: "Design & Architecture",
                  desc: "Our expert team designs intuitive user experiences and plans highly scalable, secure architectures using modern technologies.",
                },
                {
                  step: "03",
                  title: "Execute & Develop",
                  desc: "We follow agile methodologies to write clean, robust code, ensuring seamless functionality and rapid, flawless deployment.",
                },
                {
                  step: "04",
                  title: "Analyze & Grow",
                  desc: "After launch, we continuously monitor performance, analyze user behavior, and optimize the product to maximize your ROI.",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[30vw] flex-shrink-0 flex flex-col rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[360px] sm:h-[400px] md:h-[450px]"
                >
                  {/* Top Half */}
                  <div className="flex-1 p-6 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-center">
                    {/* Watermark Number */}
                    <div className="absolute right-0 sm:right-2 md:-right-4 top-1/2 -translate-y-1/2 text-[6rem] sm:text-[8rem] md:text-[12rem] font-bold text-slate-100 dark:text-slate-800/50 pointer-events-none select-none z-0">
                      {card.step}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4 tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-xs sm:text-sm md:text-base">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Half */}
                  <div className="h-16 sm:h-20 bg-[#0f2e4a] dark:bg-slate-800 flex items-center justify-between px-6 sm:px-8 md:px-10 relative overflow-hidden">
                    {/* Diagonal Stripes Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,rgba(255,255,255,1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,1)_50%,rgba(255,255,255,1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
                    <span className="text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase relative z-10">
                      Step
                    </span>
                    <span className="text-white text-lg sm:text-xl font-bold relative z-10">
                      {card.step}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* OUR WORK / PROJECTS SECTION */}
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 bg-white dark:bg-slate-950">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Our Work
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Work That Drives{" "}
                  <span className="text-blue-600">Results</span>
                </h2>
              </motion.div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {[
                {
                  title: "Indux CRM",
                  category: "Business Intelligence",
                  img: "/induxcrm.webp",
                },
                {
                  title: "HRMS",
                  category: "Human Resources",
                  img: "/hrms.webp",
                },
                {
                  title: "Jemsoft",
                  category: "Insurance ERP",
                  img: "/jemsoft.webp",
                },
                {
                  title: "InduxERP",
                  category: "Enterprise Software",
                  img: "/indux_erp.webp",
                },
              ].map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 cursor-pointer flex flex-col"
                >
                  {/* Image Container */}
                  <div className="p-3 sm:p-4 md:p-6 pb-0">
                    <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={project.img}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-grow">
                    {/* Badge */}
                    <div className="mb-3 sm:mb-4">
                      <span className="inline-block bg-[#0f2e4a] text-white text-[10px] sm:text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Title & Button */}
                    <div className="flex items-center justify-between mt-auto">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 pr-2 sm:pr-4">
                        {project.title}
                      </h3>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0 ml-auto">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-12 sm:mt-16 text-center">
              <Link href="/products" className="inline-flex items-center justify-center bg-[#0f2e4a] hover:bg-blue-700 text-white px-8 py-5 sm:py-6 rounded-full font-bold tracking-wide transition-all shadow-lg shadow-[#0f2e4a]/20 cursor-pointer w-full sm:w-auto">
                View All Work
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="relative py-16 sm:py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              {/* Left Side: Static Anchor */}
              <div className="w-full lg:w-5/12 flex flex-col gap-4 sm:gap-6">
                <div className="inline-flex items-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Testimonials
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-2">
                  Trusted by Our <span className="text-blue-600">Clients</span>
                </h2>

                {/* Trust Rating Card */}
                <div className="mt-2 bg-[#0f2e4a] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg
                      className="w-16 h-16 sm:w-24 sm:h-24 text-white transform translate-x-2 -translate-y-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2">5.0</div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-blue-200 font-medium text-xs sm:text-sm tracking-wide">(30+ Reviews)</p>
                    </div>
                    <p className="text-white text-sm md:text-lg font-medium mb-6 leading-relaxed max-w-[90%]">
                      Customer experiences that speak for themselves.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-2">
                      <div className="flex -space-x-3 justify-center sm:justify-start">
                        <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f2e4a] grayscale hover:grayscale-0 transition-all" src="https://i.pravatar.cc/150?u=1" alt="avatar" />
                        <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f2e4a] grayscale hover:grayscale-0 transition-all" src="https://i.pravatar.cc/150?u=2" alt="avatar" />
                        <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f2e4a] grayscale hover:grayscale-0 transition-all" src="https://i.pravatar.cc/150?u=3" alt="avatar" />
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f2e4a] bg-blue-600 flex items-center justify-center text-white font-bold text-xs z-10">+37</div>
                      </div>

                      <a
                        href="https://www.google.com/search?sca_esv=590eb0aa4b74244e&hl=en-IN&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_8rvk6vr8yfTYT7skK3V3XFwpaMdTntxaRkoVitZ5oNvuSsJBuUECr7oGrWVEL7WbYUpLvB-GYmK1MIbvIMdk3etA_Thu6PRaHoPCDFquLsgpBZ0Hg%3D%3D&q=INDUX+TECHNOLOGY+Reviews&sa=X&ved=2ahUKEwjY9OHo7s6VAxVhzjgGHS8-DSYQ0bkNegQIJxAI&biw=1536&bih=730&dpr=1.25"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#0f2e4a] text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      >
                        Write Review <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Marquee Reviews */}
              <div className="w-full lg:w-7/12 relative mt-6 lg:mt-24 flex flex-col gap-4 sm:gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <Marquee pauseOnHover className="[--duration:40s]">
                  {firstRow.map((review, index) => (
                    <ReviewCard key={review.name + index} {...review} />
                  ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:45s] hidden sm:flex">
                  {secondRow.map((review, index) => (
                    <ReviewCard key={review.name + index} {...review} />
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </section>

        {/* BLOGS SECTION */}
        <section className="py-16 sm:py-24 lg:py-32 bg-[#0f2e4a] relative overflow-hidden">
          {/* Subtle dot pattern background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="inline-flex items-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-400 uppercase">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20"></span>
                  </div>
                  News & Blogs
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                  Our Latest <br className="hidden md:block" /> News & Blogs
                </h2>
              </div>
              <Link
                href="/blogs"
                className="bg-white text-[#0f2e4a] hover:bg-slate-100 rounded-full px-8 py-5 sm:py-6 font-bold transition-all text-xs sm:text-sm w-full sm:w-fit group inline-flex items-center justify-center cursor-pointer"
              >
                View All Blogs{" "}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedBlogs.map((blog, idx) => (
                <div
                  key={blog._id || idx}
                  className="bg-[#153a5c] rounded-3xl overflow-hidden group border border-white/5 hover:border-blue-400/30 transition-all flex flex-col shadow-xl cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden relative p-3">
                    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-800">
                      <Image
                        src={
                          blog.featuredImage ||
                          "/images/unsplash/img-62ae3366.webp"
                        }
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-1">
                    <div className="mb-4 sm:mb-5">
                      <span className="bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-3.5 py-1.5 rounded-md tracking-wide uppercase shadow-sm">
                        {blog.category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-blue-100/70 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 flex-1 line-clamp-3">
                      {blog.shortDescription}
                    </p>
                    <div className="mt-auto">
                      <Link
                        href={blog.slug === "#" ? "#" : `/blogs/${blog.slug}`}
                        className="inline-flex items-center text-blue-400 font-bold text-xs sm:text-sm hover:text-blue-300 transition-colors group/link cursor-pointer"
                      >
                        Read More{" "}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT US SECTION */}
        <section className="pt-16 sm:pt-24 lg:pt-32 pb-12 lg:pb-16 bg-white dark:bg-slate-900 relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-24">
              <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                </div>
                Contact Us
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Let's Get in{" "}
                <span className="text-blue-600">Touch</span>
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                <ContactForm />
              </div>

              {/* Right Side: Image with Magic sparkles */}
              <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0 max-w-lg mx-auto lg:max-w-none">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[4/3] lg:aspect-square">
                  <Image
                    src="/images/unsplash/img-48a7747e.webp"
                    alt="Contact Us Team"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                {/* Decorative Sparkles */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:bottom-12 md:-right-8 z-10 text-yellow-400">
                  <Star className="w-10 h-10 sm:w-16 sm:h-16 fill-yellow-400 animate-pulse drop-shadow-lg" />
                </div>
                <div className="absolute bottom-12 -right-1 sm:bottom-20 sm:-right-2 z-10 text-yellow-400">
                  <Star
                    className="w-5 h-5 sm:w-8 sm:h-8 fill-yellow-400 animate-pulse drop-shadow-md"
                    style={{ animationDelay: "500ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}