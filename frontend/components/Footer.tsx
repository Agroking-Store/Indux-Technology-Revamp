"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Grid2x2PlusIcon, ArrowRight, Send } from 'lucide-react';
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

const FacebookLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const allLinks = [
  { name: 'Services', href: '/services' },
  { name: 'Products', href: '/products' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact-us' },
   { name: 'Careers', href: '/career' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-[#0B1121] text-slate-300 pt-20 pb-8 border-t border-slate-800 overflow-hidden">
      
      {/* Background Aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0B1121] to-[#0B1121] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f60a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f60a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          
          {/* Left Section: Brand & Links */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group w-max">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Grid2x2PlusIcon className="size-6 text-white" />
              </div>
              <p className="font-sans text-3xl font-extrabold tracking-tight text-white">
                Indux<span className="text-blue-600">.</span>
              </p>
            </Link>
            
            <p className="text-slate-400 leading-relaxed text-sm">
              Empowering businesses with cutting-edge IT solutions, from CRM and ERP systems to modern web and mobile applications.
            </p>

            <div className="mt-2">
              <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
                {allLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-all hover:translate-x-1 inline-flex items-center gap-2 group cursor-pointer text-sm">
                      <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Middle Section: Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold text-xl tracking-wide">Contact Us</h4>
            
            <div className="flex flex-col gap-5 mt-2">
              <a href="mailto:connect@induxtechnology.com" className="flex items-center gap-4 text-slate-300 hover:text-blue-400 transition-colors group cursor-pointer w-max">
                <div className="p-3 rounded-2xl bg-slate-800/50 group-hover:bg-blue-900/40 transition-colors border border-slate-700/50">
                  <Mail className="size-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Email</span>
                  <span>connect@induxtechnology.com</span>
                </div>
              </a>
              
              <a href="tel:+918421538753" className="flex items-center gap-4 text-slate-300 hover:text-blue-400 transition-colors group cursor-pointer w-max">
                <div className="p-3 rounded-2xl bg-slate-800/50 group-hover:bg-blue-900/40 transition-colors border border-slate-700/50">
                  <Phone className="size-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Phone</span>
                  <span>+91 84215 38753</span>
                </div>
              </a>
              
              <div className="flex items-start gap-4 text-slate-300 group">
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 mt-1">
                  <MapPin className="size-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Address</span>
                  <span className="leading-relaxed text-sm max-w-[200px]">
                    S. No. 05, Geeta Paradise, Opp. Zensar, Kharadi, Pune, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Small Newsletter Box */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold text-xl tracking-wide">Stay Updated</h4>
            
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              
              <p className="text-slate-400 text-sm mb-4">
                Subscribe to our newsletter for the latest tech news and updates.
              </p>
              
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                  Subscribe <Send className="size-4" />
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Social Icons */}
          <div className="flex items-center gap-3">
            <a href="#" className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer hover:-translate-y-1">
              <FacebookLogoIcon className="size-4" />
            </a>
            <a href="#" className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer hover:-translate-y-1">
              <TwitterLogoIcon className="size-4" />
            </a>
            <a href="#" className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer hover:-translate-y-1">
              <LinkedInLogoIcon className="size-4" />
            </a>
            <a href="#" className="p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer hover:-translate-y-1">
              <InstagramLogoIcon className="size-4" />
            </a>
          </div>

          {/* Middle: Copyright */}
          <p className="text-slate-500 text-sm text-center md:flex-1">
            Copyright &copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold">Indux Technology</span>. All Rights Reserved.
          </p>
          
          {/* Right: Scroll to top */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-slate-800/80 hover:bg-blue-600 text-white rounded-full transition-all cursor-pointer hover:-translate-y-1 flex items-center gap-2"
          >
            <ArrowRight className="size-4 -rotate-90" />
          </button>
        </div>
      </div>
    </footer>
  );
}
