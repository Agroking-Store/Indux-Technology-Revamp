"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
	Grid2x2PlusIcon, 
	MenuIcon, 
	XIcon, 
	Users, 
	Layers, 
	Globe, 
	Cloud, 
	ShoppingCart, 
	Code,
	Smartphone,
	Bot,
	Zap,
	Database,
	Server,
	ChevronDown,
	Info,
	BookOpen,
	Briefcase,
	Phone,
	Mail,
	MapPin
} from 'lucide-react';
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';

const FacebookLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

const servicesData = {
	title: 'Services',
	main: [
		{ title: 'CRM Solutions', desc: 'Manage customer relationships', href: '/services/crm', icon: Users },
		{ title: 'ERP Systems', desc: 'Enterprise resource planning', href: '/services/erp', icon: Layers },
		{ title: 'Web Development', desc: 'Modern and fast web apps', href: '/services/web-dev', icon: Globe },
	],
	side: [
		{ title: 'Mobile App Dev', href: '/services/mobile-dev', icon: Smartphone },
		{ title: 'AI Chatbots', href: '/services/ai-chatbots', icon: Bot },
		{ title: 'Business Automation', href: '/services/automation', icon: Zap },
	]
};

const companyData = {
	title: 'Company',
	main: [
		{ title: 'About Us', desc: 'Our mission and vision', href: '/about', icon: Info },
		{ title: 'Blogs', desc: 'Latest news and articles', href: '/blogs', icon: BookOpen },
		{ title: 'Careers', desc: 'Join our growing team', href: '/careers', icon: Briefcase },
	],
	side: []
};

export default function Navbar() {
	const pathname = usePathname();

	return (
		<>
			{/* Top Contact Bar */}
			<div className="w-full bg-slate-900 text-slate-300 py-2 md:py-2 hidden md:block">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-sm font-medium">
					<div className="flex items-center gap-8">
						<a href="tel:+919876543210" className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
							<Phone className="size-4" />
							+91 98765 43210
						</a>
						<a href="mailto:info@induxtech.com" className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
							<Mail className="size-4" />
							info@induxtech.com
						</a>
						<div className="flex items-center gap-2 text-slate-400">
							<MapPin className="size-4" />
							123 Tech Park, Mumbai, India
						</div>
					</div>
					<div className="flex items-center gap-5">
						<a href="#" className="hover:text-white transition-colors cursor-pointer">
							<FacebookLogoIcon className="size-4.5 w-5 h-5" />
						</a>
						<a href="#" className="hover:text-white transition-colors cursor-pointer">
							<TwitterLogoIcon className="size-4.5 w-5 h-5" />
						</a>
						<a href="#" className="hover:text-white transition-colors cursor-pointer">
							<LinkedInLogoIcon className="size-4.5 w-5 h-5" />
						</a>
						<a href="#" className="hover:text-white transition-colors cursor-pointer">
							<InstagramLogoIcon className="size-4.5 w-5 h-5" />
						</a>
					</div>
				</div>
			</div>

			<header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/80 dark:border-slate-800">
				<div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2 cursor-pointer group">
					<Image src="/brandlogo.jpg" alt="Indux Technology" width={80} height={24} className="object-contain rounded-md shadow-sm" priority />
				</Link>

				{/* Desktop Menu */}
				<nav className="hidden lg:flex items-center h-full gap-8">
					<NavLink href="/products" title="Products" pathname={pathname} />
					<DropdownMenu data={servicesData} pathname={pathname} />
					<DropdownMenu data={companyData} pathname={pathname} />
					<NavLink href="/contact" title="Contact Us" pathname={pathname} />
				</nav>

				{/* Right Section & Mobile Menu */}
				<div className="flex items-center gap-4">
					<AnimatedThemeToggler className="hidden sm:flex size-12 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-850 hover:text-blue-600 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800" />
					
					<Button className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-6 rounded-full shadow-lg shadow-blue-500/30 text-lg transition-all hover:scale-105 hover:shadow-blue-500/50 active:scale-95 cursor-pointer border-t border-white/20">
						Get Quote
					</Button>
					
					<MobileNav pathname={pathname} />
				</div>
			</div>
		</header>
		</>
	);
}

function NavLink({ href, title, pathname }: { href: string, title: string, pathname: string }) {
	const isActive = pathname === href;
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link
			href={href}
			className={cn(
				"relative text-lg font-medium transition-colors h-full flex items-center cursor-pointer",
				isActive ? "text-blue-600" : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{title}
			{/* Aesthetic Bottom Hover Line */}
			<motion.span
				className="absolute bottom-[28px] left-0 w-full h-[3px] rounded-full bg-blue-600 origin-left"
				initial={false}
				animate={{ scaleX: isActive || isHovered ? 1 : 0 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			/>
		</Link>
	);
}

function DropdownMenu({ data, pathname }: { data: typeof servicesData, pathname: string }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div 
			className="relative h-full flex items-center"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex items-center gap-1 cursor-pointer text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
				{data.title}
				<motion.div
					animate={{ rotate: isHovered ? 180 : 0 }}
					transition={{ duration: 0.2 }}
				>
					<ChevronDown className="size-4" />
				</motion.div>
			</div>
			{/* Aesthetic Bottom Hover Line */}
			<motion.span
				className="absolute bottom-[28px] left-0 w-full h-[3px] rounded-full bg-blue-600 origin-left"
				initial={false}
				animate={{ scaleX: isHovered ? 1 : 0 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			/>

			{/* Dropdown Content - Bento Grid Mega Menu */}
			<AnimatePresence>
				{isHovered && (
					<motion.div 
						className={cn("absolute top-[80px] left-1/2 -translate-x-1/2 pt-2", data.side && data.side.length > 0 ? "w-[900px]" : "w-[750px]")}
						initial={{ opacity: 0, y: 10, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.98 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						<div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 flex gap-6">
					
					{/* Left Side: 3 Horizontal Grid Cards */}
					<div className="flex-1 grid grid-cols-3 gap-4">
						{data.main.map((item, idx) => (
							<Link 
								key={idx} 
								href={item.href || '#'} 
								className="relative flex flex-col justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/10 transition-all group/card overflow-hidden min-h-[220px]"
							>
								{/* Grid Background Pattern */}
								<div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 group-hover/card:opacity-100 transition-opacity duration-300" />
								
								<div className="relative z-10 text-slate-700 dark:text-slate-305 group-hover/card:text-blue-600 transition-colors">
									<item.icon className="size-7 stroke-[1.5]" />
								</div>
								<div className="relative z-10 mt-8">
									<h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover/card:text-blue-700 dark:group-hover/card:text-blue-400 transition-colors">{item.title}</h4>
									<p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
								</div>
							</Link>
						))}
					</div>

					{/* Right Side: Vertical List with Hover Effects */}
					{data.side && data.side.length > 0 && (
						<div className="w-64 flex flex-col justify-center border-l dark:border-slate-800 pl-6 gap-1">
							{data.side.map((item, idx) => (
								<Link 
									key={idx} 
									href={item.href} 
									className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl p-3 transition-all flex items-center justify-between group/link"
								>
									<div className="flex items-center gap-3">
										<div className="text-slate-400 group-hover/link:text-blue-600 transition-colors">
											<item.icon className="size-5 stroke-[1.5]" />
										</div>
										{item.title}
									</div>
									<span className="text-slate-400 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300">
										→
									</span>
								</Link>
							))}
						</div>
					)}

				</div>
			</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function MobileNav({ pathname }: { pathname: string }) {
	const [openSection, setOpenSection] = useState<string | null>(null);

	const toggleSection = (section: string) => {
		setOpenSection(openSection === section ? null : section);
	};

	return (
		<Sheet>
			<SheetTrigger render={<Button size="icon" variant="ghost" className="rounded-full lg:hidden" />}>
				<MenuIcon className="size-7 text-slate-700 dark:text-slate-200" />
			</SheetTrigger>
			<SheetContent
				className="bg-white/95 dark:bg-slate-900/95 supports-[backdrop-filter]:bg-white/80 w-full md:max-w-md backdrop-blur-xl border-l dark:border-slate-800 p-0 flex flex-col"
				showCloseButton={false}
			>
				<div className="flex h-24 items-center justify-between border-b dark:border-slate-800 px-8">
					<p className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
						Indux<span className="text-blue-600">.</span>
					</p>
					<SheetClose render={<Button size="icon" variant="ghost" className="rounded-full" />}>
						<XIcon className="size-7 text-slate-700 dark:text-slate-200" />
						<span className="sr-only">Close menu</span>
					</SheetClose>
				</div>
				
				<div className="flex-1 overflow-y-auto py-8 px-8 flex flex-col gap-6">
					
					{/* Services Accordion */}
					<div>
						<button 
							onClick={() => toggleSection('services')}
							className="flex items-center justify-between w-full text-2xl font-bold text-slate-900 dark:text-white mb-2"
						>
							Services
							<ChevronDown className={cn("size-6 transition-transform", openSection === 'services' && "rotate-180")} />
						</button>
						{openSection === 'services' && (
							<div className="flex flex-col gap-4 mt-4 ml-4 border-l-2 dark:border-slate-800 pl-4">
								{servicesData.main.map((item) => (
									<Link key={item.title} href={item.href || '#'} className="text-lg font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">{item.title}</Link>
								))}
								{servicesData.side.map((item) => (
									<Link key={item.title} href={item.href} className="text-lg font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">{item.title}</Link>
								))}
							</div>
						)}
					</div>

					{/* Company Accordion */}
					<div>
						<button 
							onClick={() => toggleSection('company')}
							className="flex items-center justify-between w-full text-2xl font-bold text-slate-900 dark:text-white mb-2"
						>
							Company
							<ChevronDown className={cn("size-6 transition-transform", openSection === 'company' && "rotate-180")} />
						</button>
						{openSection === 'company' && (
							<div className="flex flex-col gap-4 mt-4 ml-4 border-l-2 dark:border-slate-800 pl-4">
								{companyData.main.map((item) => (
									<Link key={item.title} href={item.href || '#'} className="text-lg font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">{item.title}</Link>
								))}
							</div>
						)}
					</div>

					<SheetClose render={<Link href="/products" className="block text-2xl font-bold text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />}>
						Products
					</SheetClose>
					<SheetClose render={<Link href="/contact" className="block text-2xl font-bold text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />}>
						Contact Us
					</SheetClose>
				</div>

				<div className="p-8 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
					<Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-8 rounded-2xl text-xl shadow-lg shadow-blue-500/30 cursor-pointer border-t border-white/20">
						Get Quote
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}