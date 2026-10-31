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
  Cpu,
  Briefcase,
  Smile,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBlogs, submitLead, Blog } from "@/lib/api";

import { NumberTicker } from "@/components/ui/number-ticker";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { Marquee } from "@/components/ui/marquee";
import { ContactForm } from "@/components/ContactForm";
import { GetQuoteModal } from "@/components/GetQuoteModal";

// Review data
const reviews = [
  {
    name: "Paras Bora",
    role: "Director",
    company: "Bora Logistics",
    rating: 5,
    body: "Laxman is very good at his work. I use the CRM software he has developed for us. Reaping good benefits and is cost effective as well.",
  },
  {
    name: "Subhangi Solunke",
    role: "Operations Head",
    company: "Solunke Enterprises",
    rating: 5,
    body: "Great experience with Indux Technology. They understood our needs and delivered perfectly. Professional team with smooth collaboration.",
  },
  {
    name: "Nikhil Sharma",
    role: "Founder",
    company: "Eventpreneur",
    rating: 5,
    body: "Laxman has great knowledge about his industry and has been super productive with this delivery. Wishing you many success ahead.",
  },
  {
    name: "Aditya Chakre",
    role: "Business Owner",
    company: "Chakre Retail",
    rating: 5,
    body: "Just wanted to share my experience with Indux Technology. I used them for a CRM project and it was a really good experience. The project turned out great!",
  },
  {
    name: "Aditya Shastri",
    role: "Managing Director",
    company: "Shastri Digital",
    rating: 5,
    body: "Indux Technology played a key role in our digital transformation journey. From strategy to execution, they provided end-to-end solutions.",
  },
  {
    name: "Satish Mundalik",
    role: "Sales Director",
    company: "Mundalik Realty",
    rating: 5,
    body: "Laxman is a master of CRM — creating strong connections, building trust, and maintaining lasting relationships. Every contact is valuable.",
  },
  {
    name: "Priyanka V",
    role: "Managing Partner",
    company: "Memories Worldwide",
    rating: 5,
    body: "Gives very genuine and practical solutions to our business problems through their custom CRM software.",
  },
  {
    name: "Atif Pervez",
    role: "Technical Lead",
    company: "AP Technologies",
    rating: 5,
    body: "Indux Technology delivered a reliable IT solution with a professional and responsive team. A dependable development partner.",
  },
];
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  name,
  role,
  company,
  rating,
  body,
}: {
  name: string;
  role?: string;
  company?: string;
  rating: number;
  body: string;
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const colors = [
    "bg-red-500",
    "bg-blue-600",
    "bg-green-600",
    "bg-yellow-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-teal-600",
    "bg-orange-600",
  ];
  const bgColor = colors[name.length % colors.length];

  return (
    <figure
      className={
        "relative w-[280px] xs:w-[310px] sm:w-[350px] shrink-0 cursor-pointer overflow-hidden rounded-sm border p-4 sm:p-6 border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 transition-colors"
      }
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${bgColor}`}
        >
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <figcaption className="text-base font-bold dark:text-white truncate">
            {name}
          </figcaption>
          {(role || company) && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {role}
              {role && company ? " · " : ""}
              {company}
            </p>
          )}
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
    title: "How to Choose a CRM Your Sales Team Will Actually Use",
    category: "CRM Solutions",
    shortDescription:
      "Keep every lead, follow-up, and deal in one place so no opportunity slips away with software tailored to your sales process.",
    featuredImage: "/images/unsplash/img-62ae3366.webp",
    slug: "how-to-choose-a-crm-your-sales-team-will-actually-use",
  },
  {
    _id: "fallback-2",
    title: "ERP for Small Manufacturers: Where to Start",
    category: "Manufacturing ERP",
    shortDescription:
      "A practical guide to connecting inventory, purchasing, and production so business owners can see what is happening in real time.",
    featuredImage: "/images/unsplash/img-ca777973.webp",
    slug: "erp-for-small-manufacturers-where-to-start",
  },
  {
    _id: "fallback-3",
    title: "5 Business Tasks You Can Automate with AI This Quarter",
    category: "AI & Automation",
    shortDescription:
      "Put practical AI assistants and automated workflows to work on repetitive tasks, reporting, and customer inquiries.",
    featuredImage: "/images/unsplash/img-fbc3450c.webp",
    slug: "5-business-tasks-you-can-automate-with-ai-this-quarter",
  },
];

const faqs = [
  {
    question: "What does Indux Technology do?",
    answer:
      "Indux Technology provides custom software development, CRM and ERP solutions, web and mobile app development, AI solutions, and business automation.",
  },
  {
    question: "Where is Indux Technology located?",
    answer:
      "Indux Technology is based in Kharadi, Pune, Maharashtra, India, and offers digital solutions to businesses beyond its local area.",
  },
  {
    question: "Does Indux Technology develop custom software?",
    answer:
      "Yes. Projects can be planned around specific business requirements, workflows, features, and integration needs.",
  },
  {
    question: "How can I discuss my software project?",
    answer:
      "Visit the contact page at https://induxtechnology.com/contact-us to submit your requirements and connect with the team.",
    hasLink: true,
  },
];

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [scrollRange, setScrollRange] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [activeAboutSlide, setActiveAboutSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAboutSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Only do fake horizontal scroll on desktop
      if (window.innerWidth < 768) {
        if (trackRef.current) {
          trackRef.current.style.transform = `none`;
        }
        return;
      }

      if (!containerRef.current || !trackRef.current) return;

      const containerTop = containerRef.current.offsetTop;
      const scrollPosition = window.scrollY;

      // If we haven't reached the container, don't move horizontal track
      if (scrollPosition < containerTop) {
        trackRef.current.style.transform = `translateX(0px)`;
        return;
      }

      // Calculate how far we've scrolled inside the container
      const scrolledPastContainer = scrollPosition - containerTop;

      // Calculate the max distance we can scroll vertically for this effect
      const maxScroll = scrollRange;

      // Calculate the translation (clamp between 0 and maxScroll)
      const xTranslate = Math.min(Math.max(scrolledPastContainer, 0), maxScroll);

      // Apply the negative translation to the track
      trackRef.current.style.transform = `translateX(-${xTranslate}px)`;
    };

    const calculateRange = () => {
      if (window.innerWidth >= 768 && trackRef.current) {
        // Temporarily clear transform to calculate correct width
        trackRef.current.style.transform = `none`;
        // Total track width minus screen width = exact distance to scroll
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
        setViewportHeight(window.innerHeight);
        // Reapply scroll position immediately
        handleScroll();
      } else {
        setScrollRange(0);
        setViewportHeight(0);
      }
    };

    // Delay calculation slightly to ensure DOM is fully rendered and fonts loaded
    const timer = setTimeout(calculateRange, 100);
    window.addEventListener("resize", calculateRange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateRange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRange]);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

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

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Indux Technology",
    "description": "Indux Technology helps businesses grow with custom CRM, ERP, AI, automation, and web & mobile solutions designed to simplify work and improve efficiency.",
    "url": "https://induxtechnology.com",
    "logo": "https://induxtechnology.com/induxtechnologylogo_white.webp",
    "sameAs": [
      "https://www.linkedin.com/company/induxtechnology",
      "https://www.facebook.com/885831577953764/",
      "https://x.com/induxtechnology"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+918421538753",
      "contactType": "customer service",
      "email": "connect@induxtechnology.com",
      "availableLanguage": ["English", "Hindi", "Marathi"]
    }
  };

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Indux Technology",
    "description": "Indux Technology helps businesses grow with custom CRM, ERP, AI, automation, and web & mobile solutions designed to simplify work and improve efficiency.",
    "image": "https://induxtechnology.com/images/og-image.webp",
    "openingHours": "Mo-Fr 09:00-18:00",
    "@id": "https://induxtechnology.com/#localbusiness",
    "url": "https://induxtechnology.com",
    "telephone": "+918421538753",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Geeta Paradise, Kharadi",
      "addressLocality": "Pune",
      "addressRegion": "MH",
      "postalCode": "411014",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.5526,
      "longitude": 73.9407
    },
    "sameAs": [
      "https://www.linkedin.com/company/induxtechnology",
      "https://www.facebook.com/885831577953764/",
      "https://x.com/induxtechnology"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "3"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Paras Bora"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Laxman is very good at his work. I use the crm software he has developed for us. Reaping good benefits and is cost effective as well"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Subhangi Solunke"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Great experience with Indux Technology. They understood my needs and delivered perfectly. Professional team with smooth collaboration."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Nikhil Sharma Eventpreneur"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Laxman has great knowledge about his industry and has been super productive with this delivery. Wishing you many success ahead."
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where is Indux Technology located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Indux Technology is based in Kharadi, Pune, Maharashtra, India, and offers digital solutions to businesses beyond its local area."
        }
      },
      {
        "@type": "Question",
        "name": "What services does Indux Technology offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Indux Technology provides CRM and ERP solutions, custom software development, website development, mobile applications and business automation services, subject to the current service offering."
        }
      },
      {
        "@type": "Question",
        "name": "Can you customize software for our business?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We can discuss your workflows, requirements, integrations and budget to determine whether a customized solution is appropriate."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a software project cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pricing depends on scope, functionality, integrations, complexity and support requirements. Contact the team to discuss your requirements and receive a suitable proposal."
        }
      },
      {
        "@type": "Question",
        "name": "How do we get started?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Contact the team to discuss your requirements and arrange an initial consultation."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between CRM and ERP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CRM focuses on customer relationships and sales activities; ERP connects broader business processes such as operations, inventory, finance or production, depending on the implementation."
        }
      },
      {
        "@type": "Question",
        "name": "How can I discuss my software project?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Visit the contact page at https://induxtechnology.com/contact-us to submit your requirements and connect with the team."
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-clip bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <script
        type="application/ld+json"
        id="org-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        id="local-business-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        id="faq-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="flex-1 w-full">
        {/* TOP HERO BANNER (BELOW NAVBAR) */}


        {/* HERO SECTION */}

        <section className="relative overflow-hidden w-full pt-0 pb-4 sm:pb-6 lg:pb-8 bg-[#d3e9fe] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="w-full">
            {/* Desktop / Laptop / Large Tablet (md and up): Wide banner with text safely on left and artwork on right */}
            <div className="hidden md:block relative w-full aspect-[16/7] md:aspect-[16/6] lg:aspect-[21/9] min-h-[420px] md:min-h-[460px] overflow-hidden">
              {/* Background image: Full clean artwork */}
              <Image
                src="/hero-banner-new.png"
                alt="Indux Technology Solutions"
                fill
                priority
                sizes="100vw"
                className="object-cover object-right lg:object-center w-full h-full"
              />

              {/* Heading: Confined to 39% width so it never touches the hand at 45% */}
              <div className="absolute left-[5%] lg:left-[7%] top-[16%] lg:top-[18%] z-10 w-[40%] max-w-xl">
                <h1 className="text-[clamp(24px,3.3vw,52px)] font-bold leading-[1.12] tracking-tight text-[#080b2d]">
                  Custom Software,
                  <br />
                  CRM &amp; ERP Solutions
                  <br />
                  for Growing Businesses
                </h1>
              </div>

              {/* Description: Confined to 38% width with ample clearance from the hand */}
              <div className="absolute left-[5%] lg:left-[7%] top-[52%] lg:top-[53%] z-10 w-[38%] max-w-lg">
                <p className="text-[clamp(12px,1.1vw,16px)] leading-[1.5] text-[#252a35]">
                  Indux Technology helps businesses streamline operations with
                  CRM and ERP software, custom applications, websites and
                  AI-powered automation. From business process improvement to
                  tailored software development, we build solutions around your
                  requirements.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="absolute left-[5%] lg:left-[7%] top-[76%] z-20 flex items-center gap-3">
                <Link
                  href="/contact-us"
                  className="inline-flex h-12 px-7 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:scale-105 transition-all whitespace-nowrap"
                >
                  Book a Free Consultation
                </Link>

                <Link
                  href="/services"
                  className="inline-flex h-12 px-7 items-center justify-center gap-1.5 text-sm sm:text-base font-semibold text-blue-600 bg-transparent border-2 border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg shadow-sm hover:shadow-lg hover:shadow-blue-600/20 hover:scale-105 transition-all whitespace-nowrap"
                >
                  Explore Our Solutions
                </Link>
              </div>
            </div>

            {/* Mobile Layout (< 768px): Centered Stacked Layout */}
            <div className="block md:hidden bg-[#d3e9fe] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <div className="px-5 pt-8 pb-4 flex flex-col items-center text-center gap-4">
                {/* Heading: Centered */}
                <h1 className="text-[26px] xs:text-[30px] font-bold leading-[1.2] tracking-tight text-[#080b2d] dark:text-white">
                  Custom Software,
                  <br />
                  CRM &amp; ERP Solutions
                  <br />
                  for Growing Businesses
                </h1>

                {/* Description: Centered with comfortable width */}
                <p className="text-[14px] leading-relaxed text-[#252a35] dark:text-slate-300 max-w-md">
                  Indux Technology helps businesses streamline operations with
                  CRM and ERP software, custom applications, websites and
                  AI-powered automation. From business process improvement to
                  tailored software development, we build solutions around your
                  requirements.
                </p>

                {/* CTA Buttons: Stacked vertically (ek ke upar ek), full width, centered */}
                <div className="flex flex-col w-full max-w-xs gap-3 pt-2">
                  <Link
                    href="/contact-us"
                    className="w-full inline-flex h-10 px-5 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all text-center whitespace-nowrap"
                  >
                    Book a Free Consultation
                  </Link>

                  <Link
                    href="/services"
                    className="w-full inline-flex h-10 px-5 items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#080b2d] dark:text-white bg-transparent border-2 border-blue-600/60 hover:border-blue-600 hover:bg-blue-600/10 active:scale-[0.98] rounded-lg transition-all text-center whitespace-nowrap"
                  >
                    Explore Our Solutions →
                  </Link>
                </div>

                {/* Illustration: Clean centered artwork */}
                <div className="relative w-full aspect-[584/380] mt-3">
                  <Image
                    src="/hero-artwork.png"
                    alt="Indux Technology Solutions"
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ABOUT US SECTION */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950 pb-8 sm:pb-12 lg:pb-16 pt-0">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
              {/* Left Side: 3-Image Showcase Slider fitting cleanly inside the block */}
              <div className="relative w-full aspect-[1024/677] max-w-lg lg:max-w-none mx-auto flex flex-col justify-center">
                <div className="relative w-full h-full rounded-sm overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group">
                  {[
                    {
                      src: "/about-slide-1.webp",
                      alt: "Indux Technology - Tailored CRM, ERP & App Solutions",
                    },
                    {
                      src: "/about-slide-2.webp",
                      alt: "Indux Technology - Streamlining Manual Spreadsheets & Processes",
                    },
                    {
                      src: "/about-slide-3.webp",
                      alt: "Indux Technology - In-house Expert Engineering Team",
                    },
                  ].map((slide, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${activeAboutSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        loading={idx === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center"
                      />
                    </div>
                  ))}

                  {/* Navigation dots on bottom right */}
                  <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-slate-900/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
                    {[0, 1, 2].map((dot) => (
                      <button
                        key={dot}
                        type="button"
                        onClick={() => setActiveAboutSlide(dot)}
                        aria-label={`Show slide ${dot + 1}`}
                        className={`transition-all rounded-full ${activeAboutSlide === dot
                          ? "w-5 h-2 bg-blue-500"
                          : "w-2 h-2 bg-white/60 hover:bg-white"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Text & Features */}
              <div className="flex flex-col gap-4 sm:gap-6"
              >
                <div className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  </div>
                  COMPANY ABOUT
                </div>

                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-medium text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                  Software built around how your business{" "}
                  <span className="italic text-slate-600 dark:text-slate-400 font-serif">
                    actually works
                  </span>
                </h2>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base mt-1 sm:mt-2 max-w-lg">
                  Since 2021, Indux Technology has helped businesses in India and across Globe replace spreadsheets, scattered tools and manual follow-ups with software made for them. Our in-house team builds CRM, ERP, HRMS, web & mobile apps, and stays with you after launch.
                </p>

                <div className="mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-4">
                    {[
                      "Quick response on urgent fixes",
                      "A team that learns your industry",
                      "Clear scope and pricing before we start",
                    ].map((item, i) => (
                      <div key={i}
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
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <Link href="/contact-us" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-12 px-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer group">
                      Connect With Us{" "}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Solid Bottom Banner */}
          <div className="bg-[#0f2e4a] dark:bg-slate-900 w-full py-10 sm:py-12 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-4 md:divide-x divide-blue-800/40 dark:divide-slate-800"
              >
                {[
                  {
                    num: 5,
                    suffix: "+",
                    label: "Years of Experience",
                    icon: Cpu,
                  },
                  {
                    num: 187,
                    suffix: "+",
                    label: "Projects Delivered",
                    icon: Briefcase,
                  },
                  {
                    num: 30,
                    suffix: "+",
                    label: "Team Members",
                    icon: Users,
                  },
                  {
                    num: 170,
                    suffix: "+",
                    label: "Happy Clients",
                    icon: Smile,
                  },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 md:px-6 lg:px-8 first:pl-0 last:pr-0"
                    >
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-[1.5px] border-blue-400/20 flex items-center justify-center bg-blue-800/10 shrink-0">
                        <Icon
                          className="w-5 h-5 sm:w-7 sm:h-7 text-blue-300"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-0.5 sm:mb-1">
                          {stat.num}{stat.suffix}
                        </h3>
                        <p className="text-blue-100/70 font-medium text-[10px] sm:text-[11px] md:text-xs tracking-wider capitalize">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="relative overflow-hidden pb-8 sm:pb-12 lg:pb-16 pt-0 bg-slate-50 dark:bg-slate-950">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Area */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
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
            </div>


            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Custom CRM Software",
                  description:
                    "Tailored Customer Relationship Management systems to streamline sales, marketing, and support pipelines seamlessly.",
                  image: "/services/crm-solution-banner.webp",
                  alt: "Custom CRM - Built Around Your Business",
                  link: "/services/crm",
                },
                {
                  title: "Manufacturing ERP",
                  description:
                    "Robust Enterprise Resource Planning software designed to optimize supply chains and inventory management.",
                  image: "/services/erp-banner.webp",
                  alt: "Manufacturing ERP - Smarter Operations Higher Productivity",
                  link: "/services/erp",
                },
                {
                  title: "Sales Automation",
                  description:
                    "Intelligent automation tools to accelerate your sales cycle, track performance, and boost revenue effortlessly.",
                  image: "/services/automation-banner.webp",
                  alt: "Sales Automation - Work Smarter Close Faster",
                  link: "/services/automation",
                },
                {
                  title: "Custom Software Development",
                  description:
                    "Turn business requirements into web applications and secure software tailored to your agreed workflows.",
                  image: "/services/web-dev-banner.webp",
                  alt: "Custom Software Development - Modern Web Applications",
                  link: "/services/web-dev",
                },
                {
                  title: "Mobile App Development",
                  description:
                    "Create high-performance iOS and Android mobile experiences for customer services and business operations.",
                  image: "/services/mobile-dev-banner.webp",
                  alt: "Mobile App Development - Cross-Platform iOS and Android",
                  link: "/services/mobile-dev",
                },
                {
                  title: "AI & Business Automation",
                  description:
                    "Practical AI assistants, conversational chatbots, and automated workflows to reduce repetitive tasks and elevate ROI.",
                  image: "/services/ai-solutions-banner.webp",
                  alt: "AI & Business Automation - Chatbots and Smart Workflows",
                  link: "/services/ai-chatbots",
                },
              ].map((service, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(service.link)}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-600 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2"
                >
                  <div className="p-3 sm:p-4 h-48 sm:h-56 md:h-64">
                    <div className="relative w-full h-full rounded-sm overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-2">
                      <Image
                        src={service.image}
                        alt={service.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain transition-all duration-700"
                      />
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 pt-2 sm:pt-4 flex flex-col flex-grow">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white mb-2 sm:mb-3 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-100 mb-3 transition-colors leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-lg border border-blue-600/20 dark:border-blue-400/20 bg-blue-50/50 dark:bg-blue-950/30 group-hover:bg-white group-hover:text-blue-600 group-hover:border-white group-hover:shadow-md transition-all duration-300">
                        Learn more{" "}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-blue-600 dark:text-blue-400 group-hover:text-blue-600" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 sm:mt-16 flex justify-center w-full">
              <Link href="/services" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 px-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer group">
                  View All Services{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION - STICKY SCROLL */}
        <section className="bg-slate-50/50 dark:bg-slate-950/50 relative overflow-visible py-8 sm:py-12 lg:py-16">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-start relative">
              {/* Left Side: Sticky Content */}
              <div className="w-full lg:w-5/12 lg:sticky lg:top-32 z-10">
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] sm:leading-[1.1] mb-3 sm:mb-4">
                  We don't just write code, <br className="hidden md:block" />
                  We build your{" "}
                  <LineShadowText
                    className="text-blue-600"
                    shadowColor="#2563eb"
                  >
                    business
                  </LineShadowText>
                </h2>

                <div className="inline-flex items-center justify-start gap-2.5 font-bold tracking-wider text-sm sm:text-base text-blue-600 uppercase mb-4 sm:mb-6">
                  <div className="flex gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Why Indux Technology
                </div>

                <ul className="space-y-3 max-w-md mb-8 sm:mb-10 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                  {[
                    "Business-focused solutions designed around actual operational needs.",
                    "Customized development aligned with agreed requirements.",
                    "Integration opportunities to connect systems and information flows.",
                    "Collaborative delivery with clear scope and priorities.",
                    "Support and enhancements according to the agreed service arrangement.",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" strokeWidth={3} />
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact-us" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-12 px-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer group">
                    Consult With Our Expertise{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Right Side: Scrollable Cards */}
              <div className="w-full lg:w-7/12 flex flex-col gap-6 lg:gap-8 lg:pb-12">
                {[
                  {
                    icon: Users,
                    title: "Developers you can talk to",
                    desc: "You work directly with the people building your software.",
                  },
                  {
                    icon: ClipboardCheck,
                    title: "Delivery in phases",
                    desc: "You see working software every sprint, not only at the end.",
                  },
                  {
                    icon: Code2,
                    title: "Built to grow",
                    desc: "Our architecture handles more users, branches and features without a rebuild.",
                  },
                  {
                    icon: LineChart,
                    title: "No surprises",
                    desc: "Regular progress reports and one point of contact.",
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  const numStr = String(idx + 1).padStart(2, "0");
                  return (
                    <div
                      key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center w-full group"
                    >
                      {/* Huge Number */}
                      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold text-blue-800/10 dark:text-blue-500/10 leading-none tracking-tighter sm:mt-2 w-16 sm:w-20 md:w-28 flex-shrink-0">
                        {numStr}
                      </div>

                      {/* Content Card */}
                      <div className="bg-white dark:bg-slate-900 rounded-sm p-5 sm:p-6 md:p-8 border-[1.5px] border-slate-200 dark:border-slate-800 transition-all duration-500 flex-1 relative group-hover:border-blue-800/30 dark:group-hover:border-blue-500/30 w-full">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-sm bg-slate-900 dark:bg-blue-900/40 flex items-center justify-center mb-3 sm:mb-4">
                          <Icon
                            className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-blue-400"
                            strokeWidth={2}
                          />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-slate-900 dark:text-white mb-2 tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        {/* WORK PROCESS SECTION */}
        <section className="relative bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 lg:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
              <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                </div>
                Our Work Process
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4">
                From idea to a product your team uses every day
              </h2>
            </div>

            {/* CSS Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {[
                {
                  step: "01",
                  title: "Discover and Plan",
                  desc: "We learn your goals, users and processes, then agree on scope, timeline and cost.",
                },
                {
                  step: "02",
                  title: "Design and Architect",
                  desc: "We design simple, intuitive screens and a secure, scalable foundation.",
                },
                {
                  step: "03",
                  title: "Build and Test",
                  desc: "We develop in short sprints, so you review working software regularly.",
                },
                {
                  step: "04",
                  title: "Launch and Improve",
                  desc: "We deploy, train your team, then monitor usage and keep improving.",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col rounded-sm overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group"
                >
                  <div className="p-6 md:p-8 relative flex flex-col justify-between h-full min-h-[260px] sm:min-h-[290px] md:min-h-[310px]">
                    {/* Background Step Number - positioned inside card boundaries */}
                    <div className="absolute right-3 sm:right-4 bottom-2 sm:bottom-3 text-[4.5rem] sm:text-[5.5rem] md:text-[6.5rem] font-black text-slate-100 dark:text-slate-800/40 pointer-events-none select-none leading-none z-0 tracking-tighter">
                      {card.step}
                    </div>

                    {/* Step pill and Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900/50">
                        {card.step}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR WORK / PROJECTS SECTION */}
        <section className="relative overflow-hidden py-8 sm:py-12 lg:py-16 bg-white dark:bg-slate-950">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <div >
                <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                  </div>
                  Our Creation
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Products we have <span className="text-blue-600">built</span>
                </h2>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {[
                {
                  title: "Indux CRM",
                  alt: "Indux CRM dashboard for managing customers and business operations",
                  category: "Business Intelligence",
                  img: "/induxcrm.webp",
                  link: "/products/indux-crm",
                },
                {
                  title: "HRMS",
                  alt: "HRMS software dashboard for managing employee information and HR operations",
                  category: "Human Resources",
                  img: "/hrms.webp",
                  link: "/products/hrms-suite",
                },
                {
                  title: "Jemsoft",
                  alt: "Jemsoft business software solution by Indux Technology",
                  category: "Insurance ERP",
                  img: "/jemsoft.webp",
                  link: "/products/jem-soft",
                },
                {
                  title: "InduxERP",
                  alt: "InduxERP dashboard for managing business processes and operations",
                  category: "Enterprise Software",
                  img: "/indux_erp.webp",
                  link: "/products/indux-erp",
                },
              ].map((project, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(project.link)}
                  className="group bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 cursor-pointer flex flex-col"
                >
                  {/* Image Container */}
                  <div className="p-3 sm:p-4 md:p-6 pb-0">
                    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={project.img}
                        alt={project.alt || project.title}
                        width="800"
                        height="600"
                        loading="lazy"
                        className="w-full h-full object-fill"
                      />
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
                        <span className="inline-block bg-[#0f2e4a]/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 sm:p-6 md:p-8 pt-4 sm:pt-5 md:pt-6 flex flex-col flex-grow justify-center">
                    {/* Title & Button */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 pr-2 sm:pr-4">
                        {project.title}
                      </h3>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0 ml-auto">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-12 sm:mt-16 text-center">
              <Link href="/products" className="inline-block">
                <Button className="w-full sm:w-auto h-12 px-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer group">
                  View All Work{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="relative pb-8 sm:pb-12 lg:pb-16 pt-0 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-4 justify-center">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                </div>
                Testimonials
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-2">
                What our <span className="text-blue-600">clients say</span>
              </h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
              {/* Left Side: Static Anchor */}
              <div className="w-full lg:w-5/12 flex flex-col gap-4 sm:gap-6">
                {/* Trust Rating Card */}
                <div className="mt-2 bg-[#0f2e4a] rounded-sm p-6 sm:p-8 pb-8 sm:pb-10 shadow-2xl relative overflow-hidden">
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
                    <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2">
                      5.0
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-blue-200 font-medium text-xs sm:text-sm tracking-wide">
                        (30+ Reviews)
                      </p>
                    </div>
                    <p className="text-white text-sm md:text-lg font-medium mb-6 leading-relaxed max-w-[90%]">
                      Customer experiences that speak for themselves.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-6 mt-6">
                      <div className="flex -space-x-2.5 justify-center sm:justify-start">
                        {[
                          { initials: "PB", bg: "bg-blue-600" },
                          { initials: "SS", bg: "bg-emerald-600" },
                          { initials: "AC", bg: "bg-indigo-600" },
                        ].map((avatar, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f2e4a] ${avatar.bg} flex items-center justify-center text-white font-bold text-xs shadow-sm`}
                          >
                            {avatar.initials}
                          </div>
                        ))}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0f2e4a] bg-blue-500 flex items-center justify-center text-white font-bold text-xs z-10 shadow-sm">
                          +30
                        </div>
                      </div>

                      <a
                        href="https://www.google.com/search?sca_esv=590eb0aa4b74244e&hl=en-IN&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_8rvk6vr8yfTYT7skK3V3XFwpaMdTntxaRkoVitZ5oNvuSsJBuUECr7oGrWVEL7WbYUpLvB-GYmK1MIbvIMdk3etA_Thu6PRaHoPCDFquLsgpBZ0Hg%3D%3D&q=INDUX+TECHNOLOGY+Reviews&sa=X&ved=2ahUKEwjY9OHo7s6VAxVhzjgGHS8-DSYQ0bkNegQIJxAI&biw=1536&bih=730&dpr=1.25"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        Write Review{" "}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Marquee Reviews */}
              <div className="w-full lg:w-7/12 relative mt-6 lg:mt-0 flex flex-col gap-4 sm:gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <Marquee pauseOnHover className="[--duration:40s]">
                  {firstRow.map((review, index) => (
                    <ReviewCard key={review.name + index} {...review} />
                  ))}
                </Marquee>
                <Marquee
                  reverse
                  pauseOnHover
                  className="[--duration:45s] hidden sm:flex"
                >
                  {secondRow.map((review, index) => (
                    <ReviewCard key={review.name + index} {...review} />
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </section>

        {/* BLOGS SECTION */}
        <section className="py-8 sm:py-12 lg:py-16 bg-[#0f2e4a] relative overflow-hidden">
          {/* Subtle dot pattern background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-start gap-4 sm:gap-6 mb-8 sm:mb-10">
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
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedBlogs.map((blog, idx) => (
                <Link
                  key={blog._id || idx}
                  href={!blog.slug || blog.slug === "#" ? "/blogs" : `/blogs/${blog.slug}`}
                  className="bg-[#153a5c] rounded-sm overflow-hidden border border-white/5 hover:border-blue-400/30 transition-all shadow-xl group flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="p-3">
                    <div className="relative h-48 sm:h-56 md:h-64 rounded-sm overflow-hidden bg-slate-800">
                      <img
                        src={
                          blog.featuredImage
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${blog.featuredImage}`
                            : "/images/unsplash/img-62ae3366.webp"
                        }
                        alt={
                          blog.title.includes("Cloud Migration")
                            ? "Cloud migration guide for businesses and enterprise applications"
                            : blog.title.includes("Cybersecurity")
                              ? "Cybersecurity threats and protection strategies for businesses"
                              : blog.title.includes("AI is Revolutionizing")
                                ? "AI technology transforming custom enterprise software solutions"
                                : blog.title
                        }
                        width="800"
                        height="600"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-md w-fit uppercase">
                      {blog.category}
                    </span>

                    <h3 className="mt-4 text-xl font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="mt-3 text-blue-100/70 text-sm flex-1 line-clamp-3">
                      {blog.shortDescription}
                    </p>

                    <div className="mt-6 inline-flex items-center text-blue-400 font-bold hover:text-blue-300">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 sm:mt-10 flex justify-center">
              <Link href="/blogs" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 px-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer group">
                  View All Blogs{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CONTACT US SECTION */}
        <section className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-slate-900 relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                </div>
                Contact Us
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Tell us what you are <span className="text-blue-600">building</span>
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                Share a few details and we will reply within one business day with next steps.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                <ContactForm />
              </div>

              {/* Right Side: Image with Magic sparkles */}
              <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0 max-w-lg mx-auto lg:max-w-none">
                <div className="relative rounded-sm overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[4/3] lg:aspect-square">
                  <Image
                    src="/contact-us.png"
                    alt="Contact Us Team"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
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


        {/* FAQS SECTION */}
        <section className="py-8 sm:py-12 lg:py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center gap-2 font-bold tracking-wider text-xs sm:text-sm text-blue-600 uppercase mb-3 sm:mb-4">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                </div>
                Common Queries
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Frequently Asked <span className="text-blue-600">Questions</span>
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {[
                {
                  question: "Where is Indux Technology located?",
                  answer:
                    "Indux Technology is based in Kharadi, Pune, Maharashtra, India, and offers digital solutions to businesses beyond its local area.",
                },
                {
                  question: "What services does Indux Technology offer?",
                  answer:
                    "Indux Technology provides CRM and ERP solutions, custom software development, website development, mobile applications and business automation services, subject to the current service offering.",
                },
                {
                  question: "Can you customize software for our business?",
                  answer:
                    "We can discuss your workflows, requirements, integrations and budget to determine whether a customized solution is appropriate.",
                },
                {
                  question: "How much does a software project cost?",
                  answer:
                    "Pricing depends on scope, functionality, integrations, complexity and support requirements. Contact the team to discuss your requirements and receive a suitable proposal.",
                },
                {
                  question: "How do we get started?",
                  answer:
                    "Contact the team to discuss your requirements and arrange an initial consultation.",
                },
                {
                  question: "What is the difference between CRM and ERP?",
                  answer:
                    "CRM focuses on customer relationships and sales activities; ERP connects broader business processes such as operations, inventory, finance or production, depending on the implementation.",
                },
                {
                  question: "How can I discuss my software project?",
                  answer: (
                    <span>
                      Visit the contact page at{" "}
                      <Link
                        href="/contact-us"
                        className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4 hover:text-blue-700"
                      >
                        https://induxtechnology.com/contact-us
                      </Link>{" "}
                      to submit your requirements and connect with the team.
                    </span>
                  ),
                },
              ].map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-4 sm:px-8 py-4 sm:py-6 text-left flex items-center justify-between gap-3 sm:gap-4 font-bold text-slate-900 dark:text-white text-base sm:text-lg cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <span className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base md:text-lg">
                        <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : ""
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-8 sm:pb-6 pt-0 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed pl-11 sm:pl-16">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
