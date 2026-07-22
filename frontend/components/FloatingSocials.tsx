"use client";

import React from "react";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const FacebookLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const socials = [
  { name: "LinkedIn", icon: LinkedInLogoIcon, href: "https://www.linkedin.com/company/indux-technology/", color: "hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]" },
  { name: "Twitter", icon: FaXTwitter, href: "https://x.com/induxtechnology", color: "hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white hover:border-black dark:hover:border-white" },
  { name: "Facebook", icon: FacebookLogoIcon, href: "https://www.facebook.com/885831577953764/", color: "hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2]" },
  { name: "Instagram", icon: InstagramLogoIcon, href: "https://www.instagram.com/indux.technology", color: "hover:bg-[#e4405f] hover:text-white hover:border-[#e4405f]" },
  { name: "WhatsApp", icon: FaWhatsapp, href: "https://wa.me/918421538753", target: "_blank", color: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]" },
];

export default function FloatingSocials() {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 pl-2">
      {socials.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex items-center p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden w-12 h-12 hover:w-36 hover:shadow-md cursor-pointer",
              social.color
            )}
          >
            <div className="flex items-center justify-center min-w-[22px] min-h-[22px] mr-3">
              <Icon className="w-[18px] h-[18px]" />
            </div>
            <span className="font-semibold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {social.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}
