"use client";

import Image from "next/image";
import { ArrowRight, Play, Trophy, Check, Users, ClipboardCheck, LineChart, Code2, ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { getBlogs, submitLead, Blog } from "@/lib/api";
import { motion, useScroll, useTransform } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { Marquee } from "@/components/ui/marquee";
import { ConfettiButton } from "@/components/ui/confetti";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  service: z.string().min(1, "Please select a service."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Review data
const reviews = [
  { name: "John Doe", username: "@johndoe", body: "Indux Technology completely transformed our IT infrastructure. Highly recommended!", img: "https://i.pravatar.cc/150?u=10" },
  { name: "Jane Smith", username: "@janesmith", body: "The CRM they built for us increased our sales by 40%. Truly amazing work.", img: "https://i.pravatar.cc/150?u=20" },
  { name: "Alex Johnson", username: "@alexj", body: "Their agile delivery and transparent reporting kept us in the loop at every stage.", img: "https://i.pravatar.cc/150?u=30" },
  { name: "Sarah Williams", username: "@sarahw", body: "Very professional team. They migrated our legacy systems to the cloud flawlessly.", img: "https://i.pravatar.cc/150?u=40" },
  { name: "Michael Brown", username: "@mikeb", body: "We've seen a massive ROI after launching the E-commerce app they designed for us.", img: "https://i.pravatar.cc/150?u=50" },
  { name: "Emily Davis", username: "@emilyd", body: "Their UI/UX team is top-notch. The new design is beautiful and highly functional.", img: "https://i.pravatar.cc/150?u=60" },
  { name: "David Wilson", username: "@davidw", body: "Great communication, on-time delivery, and clean code. What else could you ask for?", img: "https://i.pravatar.cc/150?u=70" },
  { name: "Jessica Taylor", username: "@jessicat", body: "They understood our complex business logic and delivered an elegant SaaS solution.", img: "https://i.pravatar.cc/150?u=80" },
];
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={
        "relative w-[320px] sm:w-[350px] cursor-pointer overflow-hidden rounded-2xl border p-6 border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 transition-colors"
      }
    >
      <div className="flex flex-row items-center gap-3">
        <Image className="rounded-full" width={40} height={40} alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-base font-bold dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{username}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{body}</blockquote>
    </figure>
  );
};

const fallbackBlogs = [
  {
    _id: "fallback-1",
    title: "The Ultimate Guide to Cloud Migration Strategy in 2026",
    category: "Cloud Computing",
    shortDescription: "Discover how moving your legacy systems to the cloud can improve scalability, reduce costs, and accelerate innovation.",
    featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    slug: "#",
  },
  {
    _id: "fallback-2",
    title: "Top 5 Cybersecurity Threats Every Business Must Know",
    category: "Cybersecurity",
    shortDescription: "A comprehensive look at the emerging cyber threats in the modern digital landscape and how to protect your enterprise data.",
    featuredImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    slug: "#",
  },
  {
    _id: "fallback-3",
    title: "How AI is Revolutionizing Custom Enterprise Software",
    category: "AI & Machine Learning",
    shortDescription: "Learn how integrating machine learning and AI into your business applications can automate workflows and drive unprecedented growth.",
    featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    slug: "#",
  }
];

export default function Home() {
  const processRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: processRef,
  });
  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

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

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await submitLead(data);
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });
      reset();
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit message. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-4 pb-24 lg:pt-8 lg:pb-32">
          {/* Subtle dot pattern background */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Left Side: Text Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-6 text-left max-w-xl"
              >
                <div className="inline-flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400 text-lg w-max ">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-800 -ml-1"></span>
                  </div>
                  Elevate your work with us
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Build{" "}
                  <LineShadowText className="italic" shadowColor="#2563eb">
                    Smarter.
                  </LineShadowText>
                  <br />
                  Scale Faster.
                </h1>
                
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mt-2 max-w-md">
                  Custom IT Solutions That Power Your Business.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:scale-105 cursor-pointer flex items-center gap-2">
                    Get Free Quote <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="link" className="font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 underline underline-offset-4 decoration-2 decoration-slate-300 dark:decoration-slate-700 hover:decoration-slate-800 dark:hover:decoration-slate-500 transition-all cursor-pointer">
                    Our Services
                  </Button>
                </div>
              </motion.div>

              {/* Right Side: Bento Image Grid (Custom Layout) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center"
              >
                
                {/* Floating Rotating Text Badge */}
                <div className="absolute left-0 lg:-left-6 bottom-1/4 z-20 w-32 h-32 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl dark:shadow-none dark:border dark:border-slate-800">
                  {/* Rotating Text SVG */}
                  <div className="absolute inset-2 animate-[spin_8s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 overflow-visible">
                      <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                      <text className="text-[10px] font-bold uppercase tracking-[0.2em]" fill="currentColor">
                        <textPath href="#circlePath" startOffset="0%">
                          • INDUX TECHNOLOGY • TOP RATED 
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  {/* Center Icon */}
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>

                {/* Floating Sparkles */}
                <div className="absolute right-0 bottom-10 z-20 text-blue-500 animate-pulse">
                  <Trophy className="w-12 h-12" fill="currentColor" />
                </div>

                <div className="grid grid-cols-12 grid-rows-12 gap-3 md:gap-4 w-full h-full relative z-10 p-4 md:p-8">
                  
                  {/* Left Tall Image */}
                  <div className="col-span-5 row-span-10 row-start-2 bg-slate-300 rounded-[2rem] rounded-tl-xl overflow-hidden relative shadow-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" 
                      alt="Team working" 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  
                  {/* Right Top Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-[2rem] rounded-tr-xl overflow-hidden relative shadow-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" 
                      alt="Discussion" 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  
                  {/* Right Middle Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-2xl overflow-hidden relative shadow-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop" 
                      alt="Meeting" 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>

                  {/* Right Bottom Image */}
                  <div className="col-span-7 row-span-4 bg-slate-300 rounded-[2rem] rounded-br-xl overflow-hidden relative shadow-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
                      alt="Collaboration" 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ABOUT US SECTION - NEW DESIGN */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              {/* Left Side: Overlapping Images */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative h-[500px] md:h-[600px] w-full"
              >
                {/* Back Image (Tall) */}
                <div className="absolute top-0 left-0 w-3/4 h-[85%] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-md">
                  <Image 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" 
                    alt="Team Discussion" 
                    fill 
                    className="object-cover" 
                  />
                </div>

                {/* Front Image (Square, bottom right) */}
                <div className="absolute bottom-0 right-0 w-[65%] h-[60%] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-950">
                  <Image 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" 
                    alt="IT Professional" 
                    fill 
                    className="object-cover" 
                  />
                </div>

                {/* Floating Badge (Top Right) */}
                <div className="absolute top-12 -right-4 md:-right-6 bg-blue-700 rounded-3xl rounded-tr-md text-white p-6 md:p-8 shadow-xl flex flex-col items-center justify-center min-w-[160px] transform hover:-translate-y-2 transition-transform duration-500">
                  <h3 className="text-4xl md:text-5xl font-black mb-1">
                    <NumberTicker value={7} className="text-white" />+
                  </h3>
                  <p className="text-xs font-bold tracking-widest uppercase text-blue-100 text-center leading-relaxed">
                    Years<br/>Of Experience
                  </p>
                </div>
              </motion.div>

              {/* Right Side: Text & Features */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2">
                  COMPANY ABOUT
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                  One of the fastest way to gain <span className="italic text-slate-600 dark:text-slate-400 font-serif">business success</span>
                </h2>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base mt-2 max-w-lg">
                  We empower businesses across all industries with cutting-edge IT solutions. From startups to large enterprises, our goal is to leverage the power of technology to help clients reach their target efficiently.
                </p>

                <div className="mt-2">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-sm md:text-base">Development Special Services:</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                    {[
                      "Emergency Solutions Anytime",
                      "How to improve business",
                      "Affordable price upto 2 years",
                      "Reliable & Experienced Team"
                    ].map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                        key={i} 
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={4} />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 rounded-full font-bold tracking-wider text-xs uppercase transition-all shadow-lg shadow-blue-700/20 group">
                    GET A QUOTE <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Solid Bottom Banner */}
          <div className="bg-[#0f2e4a] dark:bg-slate-900 w-full py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 md:divide-x divide-blue-800/40 dark:divide-slate-800"
              >
                {[
                  { num: 50, suffix: '+', label: 'Technology Partners' },
                  { num: 200, suffix: '+', label: 'Complete project' },
                  { num: 70, suffix: '+', label: 'Team Members' },
                  { num: 350, suffix: '+', label: 'Happy clients' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:px-8 first:pl-0 last:pr-0">
                    <div className="w-14 h-14 rounded-full border-[1.5px] border-blue-400/20 flex items-center justify-center bg-blue-800/10">
                       <Trophy className="w-6 h-6 text-blue-300 opacity-80" strokeWidth={1.5} />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                        <NumberTicker value={stat.num} className="text-white" />{stat.suffix}
                      </h3>
                      <p className="text-blue-100/70 font-medium text-[11px] md:text-xs tracking-wider uppercase">
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
        <section className="relative overflow-hidden py-24 lg:py-32 bg-slate-50 dark:bg-slate-950">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 font-bold tracking-wider text-sm text-blue-600 uppercase mb-4">
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  </div>
                  Our Services
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Accelerate Growth with Our <span className="text-blue-600">IT Expertise</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-6 py-6 rounded-full font-semibold transition-all group shadow-sm">
                  View All Services <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                <div className="p-4 h-64">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop" 
                      alt="CRM Solutions" 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                    />
                  </div>
                </div>
                <div className="p-8 pt-4 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white mb-3 transition-colors">
                    Custom CRM
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 group-hover:text-blue-100 mb-6 transition-colors leading-relaxed">
                    Tailored Customer Relationship Management systems to streamline sales, marketing, and support pipelines seamlessly.
                  </p>
                  <div className="mt-auto flex items-center font-semibold text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Manufacturing ERP (Staggered layout: Text top, Image bottom) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-600 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2"
              >
                <div className="p-8 pb-4 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white mb-3 transition-colors">
                    Manufacturing ERP
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 group-hover:text-blue-100 mb-6 transition-colors leading-relaxed">
                    Robust Enterprise Resource Planning software designed to optimize supply chains and inventory management.
                  </p>
                  <div className="mt-auto flex items-center font-semibold text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="p-4 h-64">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image 
                      src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=1000&auto=format&fit=crop" 
                      alt="Manufacturing ERP" 
                      fill 
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
                <div className="p-4 h-64">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image 
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" 
                      alt="Sales Automation" 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                    />
                  </div>
                </div>
                <div className="p-8 pt-4 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white mb-3 transition-colors">
                    Sales Automation
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 group-hover:text-blue-100 mb-6 transition-colors leading-relaxed">
                    Intelligent automation tools to accelerate your sales cycle, track performance, and boost revenue effortlessly.
                  </p>
                  <div className="mt-auto flex items-center font-semibold text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* WHY CHOOSE US SECTION - STICKY SCROLL */}
        <section className="bg-slate-50/50 dark:bg-slate-950/50 relative overflow-visible">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start relative">
              
              {/* Left Side: Sticky Content */}
              <div className="w-full lg:w-5/12 lg:sticky lg:top-32 z-10">
                <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-6">
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                    <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Why Choose Us
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                  We don't just write code, <br className="hidden md:block" />
                  We build your{" "}
                  <LineShadowText className="text-blue-600" shadowColor="#2563eb">
                    business
                  </LineShadowText>
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg max-w-md mb-10">
                  Partner with a technology team that focuses on scalable architectures, agile delivery, and driving real results for your company.
                </p>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-bold tracking-wide text-sm uppercase transition-all shadow-lg shadow-blue-600/20 group">
                  Consult with our experts <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Right Side: Scrollable Cards */}
              <div className="w-full lg:w-7/12 flex flex-col gap-8 lg:gap-12 lg:pb-32">
                
                {[
                  {
                    icon: Users,
                    title: "Expert Development Team",
                    desc: "Our team consists of highly skilled developers, problem solvers, and tech enthusiasts dedicated to building robust and innovative software solutions tailored to your unique business needs."
                  },
                  {
                    icon: ClipboardCheck,
                    title: "Agile Delivery",
                    desc: "We follow strict agile methodologies to ensure rapid, transparent, and flawless deployment of your IT projects, meeting strict deadlines without ever compromising on quality."
                  },
                  {
                    icon: Code2,
                    title: "Scalable Architecture",
                    desc: "We build scalable, future-proof code architectures that grow with your business, keeping you ahead of the competition and ready for future technological advancements."
                  },
                  {
                    icon: LineChart,
                    title: "Transparent Process",
                    desc: "Get real-time insights into your project's progress with our transparent tracking and detailed reporting. We believe in open, honest communication at every step of development."
                  }
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  const numStr = String(idx + 1).padStart(2, '0');
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-6 lg:gap-10 items-start w-full group"
                    >
                      {/* Huge Number */}
                      <div className="text-7xl md:text-8xl lg:text-[7rem] font-bold text-blue-800 dark:text-blue-500 leading-none tracking-tighter mt-4 w-24 sm:w-32 flex-shrink-0">
                        {numStr}
                      </div>

                      {/* Content Card (Strict Flat Border) */}
                      <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-8 md:p-10 border-[1.5px] border-slate-200 dark:border-slate-800 transition-all duration-500 flex-1 relative group-hover:border-blue-800/30 dark:group-hover:border-blue-500/30">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 dark:bg-blue-900/40 flex items-center justify-center mb-6">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-blue-400" strokeWidth={2} />
                        </div>
                        <h4 className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 dark:text-white mb-3 md:mb-4 tracking-tight">{feature.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}

              </div>

            </div>
          </div>
        </section>

        {/* WORK PROCESS SECTION (HORIZONTAL SCROLL) */}
        <section ref={processRef} className="relative h-[300vh] bg-slate-50 dark:bg-slate-950">
          <div className="z-10 sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div style={{ x: xTransform }} className="flex gap-8 px-4 sm:px-6 lg:px-8">
              
              {/* Intro Title Block */}
              <div className="w-[85vw] md:w-[50vw] lg:w-[35vw] flex-shrink-0 flex flex-col justify-center pr-8 lg:pr-12">
                <div className="inline-flex items-center gap-2 font-bold tracking-wider text-sm text-blue-600 uppercase mb-4">
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800"></span>
                  </div>
                  Our Work Process
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                  Step-by-Step to <br /> Your <span className="text-blue-600">Growth</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                  We collaborate closely with clients to understand their vision, goals, and target audience, conducting in-depth research to craft tailored digital solutions.
                </p>
              </div>

              {/* Process Cards */}
              {[
                { step: "01", title: "Discover & Strategize", desc: "We collaborate closely to understand your vision, target audience, and business goals, conducting in-depth research to craft a tailored digital roadmap." },
                { step: "02", title: "Design & Architecture", desc: "Our expert team designs intuitive user experiences and plans highly scalable, secure architectures using modern technologies." },
                { step: "03", title: "Execute & Develop", desc: "We follow agile methodologies to write clean, robust code, ensuring seamless functionality and rapid, flawless deployment." },
                { step: "04", title: "Analyze & Grow", desc: "After launch, we continuously monitor performance, analyze user behavior, and optimize the product to maximize your ROI." }
              ].map((card, idx) => (
                <div key={idx} className="w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[30vw] flex-shrink-0 flex flex-col rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[400px] md:h-[450px]">
                  
                  {/* Top Half */}
                  <div className="flex-1 p-8 md:p-10 relative overflow-hidden flex flex-col justify-center">
                    {/* Watermark Number */}
                    <div className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 text-[8rem] md:text-[12rem] font-bold text-slate-100 dark:text-slate-800/50 pointer-events-none select-none z-0">
                      {card.step}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{card.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm md:text-base">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Half */}
                  <div className="h-20 bg-[#0f2e4a] dark:bg-slate-800 flex items-center justify-between px-8 md:px-10 relative overflow-hidden">
                    {/* Diagonal Stripes Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,rgba(255,255,255,1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,1)_50%,rgba(255,255,255,1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
                    <span className="text-white text-xs font-bold tracking-widest uppercase relative z-10">Step</span>
                    <span className="text-white text-xl font-bold relative z-10">{card.step}</span>
                  </div>

                </div>
              ))}

            </motion.div>
          </div>
        </section>

        {/* OUR WORK / PROJECTS SECTION */}
        <section className="relative overflow-hidden py-24 lg:py-32 bg-white dark:bg-slate-950">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-sm text-blue-600 uppercase mb-4">
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Our Work
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Work That Drives <span className="text-blue-600">Results</span>
                </h2>
              </motion.div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              
              {[
                {
                  title: "Vehicle Manage soft",
                  category: "Transportation & Logistics",
                  img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000&auto=format&fit=crop"
                },
                {
                  title: "HRMS",
                  category: "Human Resources",
                  img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
                },
                {
                  title: "Gemsoft",
                  category: "Retail & E-commerce",
                  img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
                },
                {
                  title: "InduxERP",
                  category: "Enterprise Software",
                  img: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1000&auto=format&fit=crop"
                }
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
                  <div className="p-4 md:p-6 pb-0">
                    <div className="relative w-full h-[250px] sm:h-[300px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <Image 
                        src={project.img} 
                        alt={project.title} 
                        fill 
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                      />
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    {/* Badge */}
                    <div className="mb-4">
                      <span className="inline-block bg-[#0f2e4a] text-white text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Title & Button */}
                    <div className="flex items-center justify-between mt-auto">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 pr-4">
                        {project.title}
                      </h3>
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0 ml-auto">
                        <ArrowUpRight className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

            </div>

            {/* View All Button */}
            <div className="mt-16 text-center">
              <Button className="bg-[#0f2e4a] hover:bg-blue-700 text-white px-8 py-6 rounded-full font-bold tracking-wide transition-all shadow-lg shadow-[#0f2e4a]/20">
                View All Work
              </Button>
            </div>

          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="relative py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              
              {/* Left Side: Static Anchor */}
              <div className="w-full lg:w-5/12 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 font-bold tracking-wider text-sm text-blue-600 uppercase">
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Testimonials
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-2">
                  Trusted by Our <span className="text-blue-600">Clients</span>
                </h2>
                
                {/* Trust Rating Card - Made more rectangular and compact */}
                <div className="mt-2 bg-[#0f2e4a] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24 text-white transform translate-x-2 -translate-y-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                  </div>
                  <div className="relative z-10">
                    <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">4.9</div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-blue-200 font-medium text-sm tracking-wide">(40+ Reviews)</p>
                    </div>
                    <p className="text-white text-base md:text-lg font-medium mb-6 leading-relaxed max-w-[90%]">
                      Customer experiences that speak for themselves.
                    </p>
                    
                    <div className="flex -space-x-3">
                      <img className="w-10 h-10 rounded-full border-2 border-[#0f2e4a] grayscale hover:grayscale-0 transition-all" src="https://i.pravatar.cc/150?u=1" alt="avatar" />
                      <img className="w-10 h-10 rounded-full border-2 border-[#0f2e4a] grayscale hover:grayscale-0 transition-all" src="https://i.pravatar.cc/150?u=2" alt="avatar" />
                      <img className="w-10 h-10 rounded-full border-2 border-[#0f2e4a] grayscale hover:grayscale-0 transition-all" src="https://i.pravatar.cc/150?u=3" alt="avatar" />
                      <div className="w-10 h-10 rounded-full border-2 border-[#0f2e4a] bg-blue-600 flex items-center justify-center text-white font-bold text-xs z-10">+37</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Marquee Reviews (Shifted downwards) */}
              <div className="w-full lg:w-7/12 relative mt-12 lg:mt-24 flex flex-col gap-4 sm:gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <Marquee pauseOnHover className="[--duration:40s]">
                  {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                  ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:45s] hidden sm:flex">
                  {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                  ))}
                </Marquee>
              </div>

            </div>
          </div>
        </section>

        {/* BLOGS SECTION */}
        <section className="py-24 lg:py-32 bg-[#0f2e4a] relative overflow-hidden">
          {/* Subtle dot pattern background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 font-bold tracking-wider text-sm text-blue-400 uppercase">
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-white/20"></span>
                  </div>
                  News & Blogs
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                  Our Latest <br className="hidden md:block" /> News & Blogs
                </h2>
              </div>
              <Link href="/blogs" className="bg-white text-[#0f2e4a] hover:bg-slate-100 rounded-full px-8 py-6 font-bold transition-all w-fit group inline-flex items-center justify-center">
                View All Blogs <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedBlogs.map((blog, idx) => (
                <div key={blog._id || idx} className="bg-[#153a5c] rounded-3xl overflow-hidden group border border-white/5 hover:border-blue-400/30 transition-all flex flex-col shadow-xl">
                  {/* Image Container with padding like the reference */}
                  <div className="w-full h-56 md:h-64 overflow-hidden relative p-3">
                    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-800">
                      <Image 
                        src={blog.featuredImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"} 
                        alt={blog.title} 
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="mb-5">
                      <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-md tracking-wide uppercase shadow-sm">
                        {blog.category}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-blue-100/70 text-sm md:text-base leading-relaxed mb-8 flex-1 line-clamp-3">
                      {blog.shortDescription}
                    </p>
                    <div className="mt-auto">
                      <Link href={blog.slug === "#" ? "#" : `/blogs/${blog.slug}`} className="inline-flex items-center text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors group/link cursor-pointer">
                        Read More <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT US SECTION */}
        <section className="pt-24 lg:pt-32 pb-12 lg:pb-16 bg-white dark:bg-slate-900 relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
              <div className="inline-flex items-center gap-2 font-bold tracking-wider text-sm text-blue-600 uppercase mb-4">
                <div className="flex gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                </div>
                Contact Us
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Get Your Free <span className="text-blue-600">Quote Today!</span>
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              
              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Name *</Label>
                      <Input {...register("name")} placeholder="John Doe" className="h-14 px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 rounded-xl shadow-sm text-base" />
                      {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email *</Label>
                      <Input {...register("email")} type="email" placeholder="hello@example.com" className="h-14 px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 rounded-xl shadow-sm text-base" />
                      {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone *</Label>
                      <Input {...register("phone")} type="tel" placeholder="+1 (555) 000-0000" className="h-14 px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 rounded-xl shadow-sm text-base" />
                      {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 relative">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Service Interested In *</Label>
                      <Controller
                        control={control}
                        name="service"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-14 px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-blue-500 rounded-xl shadow-sm text-base">
                              <SelectValue placeholder="Select Service" />
                            </SelectTrigger>
                            <SelectContent alignItemWithTrigger={false} sideOffset={8} className="rounded-xl">
                              <SelectItem className="py-3 px-4 cursor-pointer" value="crm">CRM Solutions</SelectItem>
                              <SelectItem className="py-3 px-4 cursor-pointer" value="erp">ERP Systems</SelectItem>
                              <SelectItem className="py-3 px-4 cursor-pointer" value="webd">Web Development</SelectItem>
                              <SelectItem className="py-3 px-4 cursor-pointer" value="mobileapp">Mobile Apps</SelectItem>
                              <SelectItem className="py-3 px-4 cursor-pointer" value="ai">AI Chatbots</SelectItem>
                              <SelectItem className="py-3 px-4 cursor-pointer" value="automation">Business Automation</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.service && <p className="text-red-500 text-xs ml-1">{errors.service.message}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Message *</Label>
                    <Textarea {...register("message")} placeholder="Tell us about your project goals..." className="min-h-[150px] max-h-[300px] [field-sizing:fixed] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 rounded-xl shadow-sm text-base resize-y"></Textarea>
                    {errors.message && <p className="text-red-500 text-xs ml-1">{errors.message.message}</p>}
                  </div>

                  <ConfettiButton type="submit" className="w-fit bg-[#0f2e4a] hover:bg-blue-600 text-white rounded-full px-10 py-7 font-bold tracking-wide text-base transition-all shadow-xl shadow-blue-900/20 mt-4 group">
                    Send Message <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </ConfettiButton>
                </form>
              </div>

              {/* Right Side: Image with Magic sparkles */}
              <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[4/3] lg:aspect-square">
                  <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000" alt="Contact Us Team" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                {/* Decorative Sparkles */}
                <div className="absolute -bottom-6 -right-6 md:bottom-12 md:-right-8 z-10 text-yellow-400">
                  <Star className="w-16 h-16 fill-yellow-400 animate-pulse drop-shadow-lg" />
                </div>
                <div className="absolute bottom-20 -right-2 z-10 text-yellow-400">
                  <Star className="w-8 h-8 fill-yellow-400 animate-pulse drop-shadow-md" style={{ animationDelay: '500ms' }} />
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
