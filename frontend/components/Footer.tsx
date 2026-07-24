"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FacebookLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const allLinks = [
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Blogs", href: "/blogs" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Careers", href: "/careers" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! You have successfully subscribed to our newsletter.");
      setEmail("");
    }, 1000);
  };

  return (
    <footer className="relative bg-[#0B1121] text-slate-300 pt-20 pb-8 border-t border-slate-800 overflow-hidden">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0B1121] to-[#0B1121] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f60a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f60a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          
          {/* Left Section: Brand & Links */}
          <div className="flex flex-col gap-6 text-left">
            <Link
              href="/"
              className="flex items-center gap-2 cursor-pointer group w-max"
            >
              <Image
                src="/induxtechnologylogo_white.webp"
                alt="Indux Technology"
                width={390}
                height={113}
                className="w-[145px] md:w-[180px] h-auto object-contain"
                priority
              />
            </Link>

            <p className="text-slate-400 leading-relaxed text-sm">
              Empowering businesses with cutting-edge IT solutions, from CRM and
              ERP systems to modern web and mobile applications.
            </p>

            <div className="mt-2">
              <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
                {allLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-blue-400 transition-all pl-5 relative group cursor-pointer text-sm block w-fit"
                    >
                      {/* Placed absolutely to prevent text layout shift on hover */}
                      <ArrowRight className="size-3 absolute left-0 top-[4px] opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Middle Section: Contact Info */}
          <div className="flex flex-col gap-6 text-left">
            <h4 className="text-white font-bold text-xl tracking-wide">
              Contact Us
            </h4>

            <div className="flex flex-col gap-5 mt-2">
              <a
                href="mailto:connect@induxtechnology.com"
                className="flex items-start gap-4 text-slate-300 hover:text-blue-400 transition-colors group cursor-pointer w-fit"
              >
                <div className="p-3 rounded-2xl bg-slate-800/50 group-hover:bg-blue-900/40 transition-colors border border-slate-700/50 shrink-0 mt-0.5">
                  <Mail className="size-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                    Email
                  </span>
                  <span className="text-sm sm:text-base break-all">connect@induxtechnology.com</span>
                </div>
              </a>

              <a
                href="tel:+918421538753"
                className="flex items-start gap-4 text-slate-300 hover:text-blue-400 transition-colors group cursor-pointer w-fit"
              >
                <div className="p-3 rounded-2xl bg-slate-800/50 group-hover:bg-blue-900/40 transition-colors border border-slate-700/50 shrink-0 mt-0.5">
                  <Phone className="size-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                    Phone
                  </span>
                  <span className="text-sm sm:text-base">+91 84215 38753</span>
                </div>
              </a>

              <div className="flex items-start gap-4 text-slate-300 group">
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 shrink-0 mt-0.5">
                  <MapPin className="size-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                    Address
                  </span>
                  <span className="leading-relaxed text-sm max-w-[240px]">
                    S. No. 05, Geeta Paradise, Opp. Zensar, Kharadi, Pune, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Stay Updated */}
          <div className="flex flex-col gap-6 text-left">
            <h4 className="text-white font-bold text-xl tracking-wide">
              Stay Updated
            </h4>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group max-w-md w-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" />

              <p className="text-slate-400 text-sm mb-4">
                Subscribe to our newsletter for the latest tech news and updates.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  suppressHydrationWarning={true}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                />
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Subscribing..." : "Subscribe"} <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Balanced layout on desktop, stacked on mobile */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Left: Copyright */}
          <p className="text-slate-500 text-sm">
            Copyright &copy; {new Date().getFullYear()}{" "}
            <span className="text-slate-300 font-semibold">
              Indux Technology
            </span>
            . All Rights Reserved.
          </p>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-3 justify-center md:justify-end">
            <a
              href="https://www.facebook.com/885831577953764/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer hover:-translate-y-1"
            >
              <FacebookLogoIcon className="size-4" />
            </a>
            <a
              href="https://x.com/induxtechnology"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer hover:-translate-y-1"
            >
              <FaXTwitter className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/indux-technology/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer hover:-translate-y-1"
            >
              <LinkedInLogoIcon className="size-4" />
            </a>
            <a
              href="https://www.instagram.com/indux.technology"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer hover:-translate-y-1"
            >
              <InstagramLogoIcon className="size-4" />
            </a>
            <a
              href="https://wa.me/918421538753"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-[#25D366] hover:text-white transition-all cursor-pointer hover:-translate-y-1"
            >
              <FaWhatsapp className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
