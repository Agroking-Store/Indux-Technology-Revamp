export type WorkCategory =
  | "E-Commerce"
  | "Coaching & Corporate"
  | "SaaS & FinTech"
  | "Retail & Enterprise"
  | "Clean Energy & Industrial"
  | "IT & Digital Transformation";

export interface RecentWork {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  category: WorkCategory;
  image: string;
  client: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  technologies: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
}

export const recentWorks: RecentWork[] = [
  {
    id: 1,
    slug: "amit-mehrotra",
    title: "Amit Mehrotra",
    tagline: "Executive Coaching & Personal Transformation Platform",
    category: "Coaching & Corporate",
    image: "/recent-works/amit-mehrotra.webp",
    client: "Amit Mehrotra Coaching",
    year: "2024",
    shortDescription:
      "A high-impact digital presence, consultation booking portal, and transformation hub for acclaimed Life Coach, NLP Trainer, and EFT Practitioner Amit Mehrotra.",
    fullDescription:
      "Drawing on 17 years of rich corporate leadership and 11 years of coaching with over 12,000 satisfied clients, this platform reflects authority, warmth, and results. It features seamless one-on-one consultation scheduling, corporate workshop catalogs, client transformation testimonials, and integrated communication channels.",
    highlights: [
      "Automated Consultation Booking with Real-Time Calendar Sync",
      "Interactive Client Testimonial & Success Story Showcase",
      "Corporate Leadership Training & Workshop Curriculum Directory",
      "One-Click WhatsApp & Email Inquiry Automation",
    ],
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "Calendar API", "WhatsApp Integration"],
    metrics: [
      { label: "Satisfied Clients", value: "12,000+" },
      { label: "Booking Inquiries", value: "+180%" },
      { label: "Client Engagement", value: "98%" },
    ],
  },
  {
    id: 2,
    slug: "golden-by-queen-sona",
    title: "Golden By Queen Sona",
    tagline: "Luxury Handcrafted Brass & Heritage Artifacts Store",
    category: "E-Commerce",
    image: "/recent-works/golden-by-queen-sona.webp",
    client: "DB - Golden By Queen Sona",
    year: "2024",
    shortDescription:
      "An opulent luxury e-commerce experience showcasing timeless handcrafted stone sculptures, heritage brass idols, dhokra art, and enduring home decor.",
    fullDescription:
      "Crafted in stone and designed to endure, Golden By Queen Sona brings traditional Indian craft to modern luxury living. The platform combines editorial aesthetics with smooth catalog browsing, detailed artifact provenance, secure international payments, and white-glove packaging inquiries.",
    highlights: [
      "Curated Seasonal Artifact Drops & Limited Edition Releases",
      "High-Fidelity Product Photography with Zoom & Material Detail Views",
      "Multi-Currency Checkout with Automated Duty & Shipping Calculation",
      "Custom Artisanal Commission & Bulk Corporate Gifting Inquiries",
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "Stripe", "Cloudinary", "Framer Motion"],
    metrics: [
      { label: "Global Inquiries", value: "+220%" },
      { label: "Average Order Value", value: "+65%" },
      { label: "Catalog Views", value: "45K+" },
    ],
  },
  {
    id: 3,
    slug: "chetan-ply-hardware",
    title: "Chetan Ply & Hardware",
    tagline: "Architectural Interior & Trusted Plywood Solutions",
    category: "Retail & Enterprise",
    image: "/recent-works/chetan-ply-hardware.webp",
    client: "Chetan Ply & Hardware",
    year: "2024",
    shortDescription:
      "A modern commercial showcase and material catalog connecting architects, interior designers, and homeowners with premium plywood and hardware fittings.",
    fullDescription:
      "Chetan Ply & Hardware provides premium timber, calibrated plywood, decorative veneers, and designer hardware fittings for contemporary living spaces. The platform serves as a virtual showroom where trade professionals and residential clients can explore wood grades, inspect finishes, and request project quotes.",
    highlights: [
      "Interactive Architectural Material & Plywood Grade Showcase",
      "Interior Project Inspiration Gallery with Real-World Applications",
      "Instant B2B Project Quantity Estimator & Request-for-Quote System",
      "Dealer, Contractor, and Interior Designer Partnership Network",
    ],
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript", "Responsive UI"],
    metrics: [
      { label: "Contractor Leads", value: "4x Growth" },
      { label: "Catalog SKUs", value: "500+" },
      { label: "Showroom Footfall", value: "+40%" },
    ],
  },
  {
    id: 4,
    slug: "evoke-technologies",
    title: "Evoke Technologies",
    tagline: "Your Digital Transformation Partner & Enterprise Resource Hub",
    category: "IT & Digital Transformation",
    image: "/recent-works/evoke-technologies.webp",
    client: "Evoke Technologies",
    year: "2024",
    shortDescription:
      "A high-performance digital transformation portal, enterprise knowledge base, and resource hub accelerating modern business agility and cloud adoption.",
    fullDescription:
      "Evoke Technologies empowers global enterprises with software innovation, digital modernization, and enterprise cloud solutions. The platform features an extensive digital resource center with downloadable whitepapers, case studies across diverse industries, technology radar insights, and high-conversion B2B consultation funnels.",
    highlights: [
      "Enterprise Resource Hub & Interactive Digital Case Studies Library",
      "Interactive Service Roadmaps for Cloud, Data & Process Automation",
      "High-Performance Technical Knowledge Base & Whitepaper Downloads",
      "Secure Multi-Tier Lead Generation & B2B Consultation Routing",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Headless CMS", "Node.js", "Framer Motion"],
    metrics: [
      { label: "B2B Inquiries", value: "+175%" },
      { label: "Global Reach", value: "30+ Countries" },
      { label: "Page Speed", value: "99 / 100" },
    ],
  },
  {
    id: 5,
    slug: "megabyte-systems",
    title: "Megabyte Systems",
    tagline: "Enterprise IT Solutions, System Integration & Hardware Infrastructure",
    category: "IT & Digital Transformation",
    image: "/recent-works/megabyte-systems.webp",
    client: "Megabyte Systems",
    year: "2024",
    shortDescription:
      "A comprehensive IT infrastructure and hardware solutions portal offering server integration, networking, enterprise storage, and AMC support.",
    fullDescription:
      "Megabyte Systems delivers enterprise IT excellence through end-to-end server deployments, workstation provisioning, business software integration, and data storage. The web portal features an interactive enterprise hardware catalog, custom server configuration quotes, and rapid maintenance ticketing.",
    highlights: [
      "Server, PC & Enterprise Storage Infrastructure Configuration Catalog",
      "System Integration & Annual Maintenance Contract (AMC) Portal",
      "Custom Enterprise Software & Network Security Solutions Showcase",
      "Fast-Track Support Ticketing & Hardware Warranty Verification",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Framer Motion"],
    metrics: [
      { label: "Hardware Deployed", value: "1,200+ Units" },
      { label: "Support Resolution", value: "4x Faster" },
      { label: "Client Retention", value: "96%" },
    ],
  },
  {
    id: 6,
    slug: "neptune",
    title: "Neptune",
    tagline: "Luxury Outdoor & Terrace Living Furniture & Green Landscaping",
    category: "Retail & Enterprise",
    image: "/recent-works/neptune-luxury-living.webp",
    client: "Neptune Luxury Living",
    year: "2024",
    shortDescription:
      "An immersive luxury outdoor furniture and terrace landscaping portal where modern architectural design harmonizes with lush botanical serenity.",
    fullDescription:
      "Neptune curates high-end terrace lounges, weather-resilient patio seating, architectural planters, and landscape installations for upscale villas and boutique hospitality resorts. The digital experience offers visual moodboards, material durability guides, and bespoke architectural landscape design consultations.",
    highlights: [
      "Curated Terrace Lounges, Patio Furniture & Architectural Planters",
      "Virtual Landscape Moodboards & Living Space Design Inspiration",
      "Weatherproof All-Weather Material Durability & Finish Specs",
      "Bespoke Residential & Hospitality Consultation Scheduling",
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "Cloudinary", "Framer Motion"],
    metrics: [
      { label: "Consultation Bookings", value: "+160%" },
      { label: "High-Ticket Inquiries", value: "2.5x Growth" },
      { label: "Design Portfolio Views", value: "60K+" },
    ],
  },
  {
    id: 7,
    slug: "pic-power",
    title: "PIC POWER",
    tagline: "High-Performance Batteries & Advanced Energy Storage Solutions",
    category: "Clean Energy & Industrial",
    image: "/recent-works/pic-power.webp",
    client: "PIC POWER Energy Systems",
    year: "2024",
    shortDescription:
      "A high-capacity battery and power storage marketplace catering to electric two-wheelers, home inverters, solar setups, and commercial backups.",
    fullDescription:
      "Powering your world one charge at a time, PIC POWER specializes in heavy-duty inverter batteries, long-range EV batteries, and solar energy storage units. The platform features an intelligent battery finder by vehicle or appliance model, warranty registration, battery health calculators, and authorized dealer locator.",
    highlights: [
      "Intelligent Battery Selector by Vehicle Model & Power Requirement",
      "Electric Bike, Inverter & Solar Deep-Cycle Battery Catalog",
      "Instant Online Warranty Registration & Digital Certificate Generation",
      "Authorized Pan-India Dealer & Service Center Locator",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "REST API", "PostgreSQL"],
    metrics: [
      { label: "Batteries Powered", value: "50,000+" },
      { label: "Selector Accuracy", value: "99.8%" },
      { label: "Dealer Network", value: "350+ Hubs" },
    ],
  },
  {
    id: 8,
    slug: "progro",
    title: "PROGRO",
    tagline: "Growing Wealth, Creating Journeys - Next-Gen FinTech Platform",
    category: "SaaS & FinTech",
    image: "/recent-works/progro.webp",
    client: "PROGRO Wealth Technologies",
    year: "2024",
    shortDescription:
      "A cutting-edge wealth management and investment acceleration platform designed to empower individuals and family offices with intelligent portfolio journeys.",
    fullDescription:
      "PROGRO represents the future of personal and institutional wealth accumulation. Under the mantra 'Your future wealth begins here', the platform combines goal-based financial roadmapping, algorithmic portfolio rebalancing, alternative asset tracking, and intuitive wealth journey milestones.",
    highlights: [
      "Goal-Based Wealth Journey Roadmapping & Milestone Tracking",
      "Automated Portfolio Rebalancing & Risk Profiling Engine",
      "Integrated Multi-Asset Dashboard (Equities, Fixed Income, Alternate Assets)",
      "Real-Time Market Intelligence & Personalized Advisory Alerts",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Financial Charts API", "Framer Motion", "Node.js"],
    metrics: [
      { label: "Assets Advised", value: "$45M+" },
      { label: "User Onboarding", value: "< 2 Mins" },
      { label: "Platform Uptime", value: "99.99%" },
    ],
  },
  {
    id: 9,
    slug: "pic-power-grid-storage",
    title: "PIC POWER Grid Storage",
    tagline: "Large-Scale Sustainable Solutions & Containerized Battery Storage",
    category: "Clean Energy & Industrial",
    image: "/recent-works/pic-power-storage.webp",
    client: "PIC POWER Industrial Solutions",
    year: "2024",
    shortDescription:
      "Transforming industrial energy landscapes with utility-scale wind and solar grid integration and megawatt-capacity containerized energy storage systems (BESS).",
    fullDescription:
      "PIC POWER's industrial division engineers megawatt-class containerized energy storage units for utility grids, solar farms, and heavy manufacturing facilities. The platform features an interactive BESS configurator, hybrid renewable grid simulation, load-shifting analytics, and enterprise quotation request funnels.",
    highlights: [
      "High-Capacity Containerized Battery Energy Storage Systems (BESS)",
      "Hybrid Solar & Wind Renewable Grid Integration Architecture",
      "Peak Shaving, Frequency Regulation & Load-Shedding Calculators",
      "Industrial Turnkey EPC Quotation & Site Assessment Portal",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "SCADA Integration Docs", "3D Interactive View"],
    metrics: [
      { label: "Grid Storage Deployed", value: "80+ MWh" },
      { label: "Energy Efficiency", value: "94.5%" },
      { label: "Industrial Inquiries", value: "+240%" },
    ],
  },
  {
    id: 10,
    slug: "saylo-foods",
    title: "Saylo Pvt. Ltd.",
    tagline: "Taste the Heart of India - Authentic Atta, Crispy Chivda & Wholesome Dals",
    category: "E-Commerce",
    image: "/recent-works/saylo-foods.webp",
    client: "Saylo Foods Pvt. Ltd.",
    year: "2024",
    shortDescription:
      "A vibrant FMCG food portal bringing farm-pure stone-ground atta, artisanal chivda snacks, and unpolished pulses to dining tables across the nation.",
    fullDescription:
      "Celebrating authentic regional culinary traditions, Saylo Pvt. Ltd. delivers staple kitchen essentials and savory treats straight from the heartlands of India. The platform features direct-to-consumer online ordering, wholesale distributor inquiry portals, regional flavor showcases, and farm-to-table purity verifications.",
    highlights: [
      "Categorized Product Showcase (Stone-Ground Atta, Savory Chivda, High-Protein Dals)",
      "B2B Wholesale Inquiries & Distributor Partner Onboarding",
      "Purity & Nutritional Certification Transparency Badges",
      "Direct-to-Consumer Quick-Reorder & Subscription Grocery Engine",
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "Node.js", "PostgreSQL", "Payment Gateway"],
    metrics: [
      { label: "Monthly Orders", value: "35,000+" },
      { label: "Distributor Network", value: "18 States" },
      { label: "Purity Rating", value: "100% Lab Tested" },
    ],
  },
  {
    id: 11,
    slug: "shlok-food-lab",
    title: "Shlok Food Lab (SFL)",
    tagline: "State-of-the-Art Food Testing, R&D & Quality Certification Facility",
    category: "Retail & Enterprise",
    image: "/recent-works/shlok-food-lab.webp",
    client: "Shlok Food Lab & Research",
    year: "2024",
    shortDescription:
      "An advanced food laboratory and research facility portal in Chhatrapati Sambhajinagar providing scientific testing, FSSAI compliance, and sensory R&D.",
    fullDescription:
      "Located in Chhatrapati Sambhajinagar, Maharashtra, Shlok Food Lab (SFL) operates advanced chromatographic and microbiological testing for food manufacturers, exporters, and agricultural producers. The web portal features online test sample booking, digital report downloads, regulatory compliance checklists, and virtual laboratory tours.",
    highlights: [
      "Online Sample Submission & Barcode Test Tracking Dashboard",
      "FSSAI, NABL & Export Quality Compliance Certification",
      "Chromatography, Microbiological & Nutritional Assay Service Catalog",
      "Interactive Virtual Laboratory Facility & Equipment Walkthrough",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Secure PDF Report Generation", "REST API"],
    metrics: [
      { label: "Samples Tested", value: "120,000+" },
      { label: "Accredited Methods", value: "250+" },
      { label: "Report Turnaround", value: "48 Hours" },
    ],
  },
];
