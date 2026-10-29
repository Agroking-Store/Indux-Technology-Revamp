import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Product from "../src/models/Product";
import RecentWork from "../src/models/RecentWork";

dotenv.config();
// DNS fallback handled in connectMongo

const initialProducts = [
  {
    slug: "indux-crm",
    title: "Indux CRM",
    category: "Business Intelligence",
    shortDescription: "Manage leads, customer relationships, sales activities, and follow-ups with custom CRM software designed around your business workflows.",
    fullDescription: "Indux CRM is an enterprise-grade solution designed to unify your sales, marketing, and support teams. By centralizing customer data, it eliminates silos and provides a 360-degree view of your customer journey, allowing for data-driven decisions at every level of your organization.",
    themeColor: "blue",
    iconName: "Sparkles",
    image: "/induxcrm.webp",
    order: 1,
    status: "Published",
    stats: [
      { label: "Sales Growth", value: "+35%" },
      { label: "Lead Conversion", value: "3x Faster" },
      { label: "User Adoption", value: "98%" },
    ],
    features: [
      { title: "Lead Management", desc: "Capture leads automatically from web forms, emails, and social media. Use intelligent scoring to prioritize high-value prospects." },
      { title: "Sales Pipeline", desc: "Visualize your sales funnel with customizable stages. Drag and drop deals to update status and trigger automated follow-ups." },
      { title: "Automated Workflows", desc: "Eliminate manual data entry by setting up trigger-based actions for email sequences, task assignments, and record updates." },
      { title: "Advanced Analytics", desc: "Generate complex reports on team performance, conversion rates, and revenue forecasting with beautiful, interactive dashboards." },
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "AWS S3", "Redis"],
    faq: [
      { q: "Is Indux CRM cloud-based?", a: "Yes, it is a fully managed cloud solution accessible from any device, anywhere in the world." },
      { q: "Can we migrate data from Excel?", a: "Absolutely. We provide robust import tools and mapping services to bring your legacy data into Indux CRM seamlessly." },
    ],
  },
  {
    slug: "bill-tea",
    title: "Bill Tea",
    category: "Retail Management",
    shortDescription: "Simplifying Retail Business Management with GST-compliant billing and real-time inventory.",
    fullDescription: "Bill Tea is the ultimate tool for modern retailers. It handles the complexities of GST, inventory tracking, and purchase management, allowing you to focus on serving your customers. Designed for speed and accuracy in high-traffic retail environments.",
    themeColor: "emerald",
    iconName: "Sprout",
    image: "/billtea.webp",
    order: 2,
    status: "Published",
    stats: [
      { label: "Billing Speed", value: "-60%" },
      { label: "Inventory Error", value: "0%" },
      { label: "Compliance", value: "100%" },
    ],
    features: [
      { title: "GST Billing", desc: "Generate professional, GST-compliant invoices in seconds. Supports HSN codes, multi-tax rates, and digital signatures." },
      { title: "Stock Tracking", desc: "Real-time inventory updates as you sell. Get low-stock alerts and manage supplier orders from a single screen." },
      { title: "Barcode Integration", desc: "Speed up your checkout process with seamless barcode scanning and label printing support." },
      { title: "Customer Loyalty", desc: "Track purchase history and reward your frequent shoppers with automated points and discount programs." },
    ],
    tech: ["React", "Express.js", "MongoDB", "Socket.io", "Electron"],
    faq: [
      { q: "Does it work offline?", a: "Yes, Bill Tea has a robust offline mode that syncs your data once you're back online." },
      { q: "Can I manage multiple stores?", a: "Our Enterprise plan supports multi-location syncing and centralized inventory management." },
    ],
  },
  {
    slug: "jem-soft",
    title: "JEM Soft",
    category: "Insurance ERP",
    shortDescription: "A centralized Insurance Management System designed for LIC agents and financial advisors.",
    fullDescription: "JEM Soft bridges the gap between traditional insurance sales and digital efficiency. It empowers financial advisors to manage their entire portfolio, track commissions, and deliver professional presentations to clients, all from one secure web portal.",
    themeColor: "indigo",
    iconName: "ShieldCheck",
    image: "/jemsoft.webp",
    order: 3,
    status: "Published",
    stats: [
      { label: "Policy Retention", value: "+25%" },
      { label: "Admin Time", value: "-15hrs/wk" },
      { label: "Data Security", value: "Bank-Grade" },
    ],
    features: [
      { title: "Policy Lifecycle", desc: "Track every policy from application to maturity. Automated reminders for premium due dates and renewals." },
      { title: "Commission Tracker", desc: "Automatically calculate and track your commissions across different products and carriers." },
      { title: "Client Portals", desc: "Allow your clients to log in and view their investment summary, download receipts, and request support." },
      { title: "Plan Presentations", desc: "Generate beautiful, easy-to-understand insurance illustrations and financial plans for your prospects." },
    ],
    tech: ["TypeScript", "NestJS", "PostgreSQL", "Docker", "DigitalOcean"],
    faq: [
      { q: "Is client data kept private?", a: "Data privacy is our top priority. We use role-based access control and end-to-end encryption for all sensitive client records." },
      { q: "Does it support LIC plans?", a: "Yes, JEM Soft is specifically updated monthly with the latest LIC plan parameters and calculation logic." },
    ],
  },
  {
    slug: "sales-automation",
    title: "Sales Automation",
    category: "AI Marketing",
    shortDescription: "Automate customer leads, follow-up emails, and WhatsApp communication from one place.",
    fullDescription: "Stop letting leads fall through the cracks. Our Sales Automation suite uses AI to handle the first 48 hours of lead engagement, ensuring every prospect gets a response, even while your team sleeps.",
    themeColor: "cyan",
    iconName: "Zap",
    image: "/salesautomation.webp",
    order: 4,
    status: "Published",
    stats: [
      { label: "Response Rate", value: "100%" },
      { label: "Engagement", value: "+80%" },
      { label: "AI Accuracy", value: "94%" },
    ],
    features: [
      { title: "Email Sequences", desc: "Create multi-day automated email drips that stop once a user replies. Personalized using dynamic tags." },
      { title: "WhatsApp AI", desc: "Deploy a WhatsApp bot that can answer common questions about your products and schedule meetings 24/7." },
      { title: "Lead Scoring", desc: "Automatically rank leads based on their interactions with your emails and website." },
      { title: "Calendar Sync", desc: "Integrate with Google or Outlook to allow leads to book demos directly into your sales team's schedule." },
    ],
    tech: ["Python", "FastAPI", "OpenAI API", "PostgreSQL", "Twilio"],
    faq: [
      { q: "Will the AI sound robotic?", a: "No, we use advanced LLMs trained on your specific business tone to ensure natural, helpful conversations." },
      { q: "Can I monitor the bot?", a: "Absolutely. You can take over any live conversation at any time from the dashboard." },
    ],
  },
  {
    slug: "indux-erp",
    title: "Indux ERP",
    category: "Enterprise Operations",
    shortDescription: "Streamline core business processes from finance to operations in one unified platform.",
    fullDescription: "Indux ERP is a comprehensive suite that manages every aspect of your enterprise. From supply chain and procurement to financial consolidation and HR, it provides the single source of truth required for large-scale operations.",
    themeColor: "blue",
    iconName: "BarChart3",
    image: "/indux_erp.webp",
    order: 5,
    status: "Published",
    stats: [
      { label: "Op. Efficiency", value: "+40%" },
      { label: "Overhead Cost", value: "-20%" },
      { label: "Real-time Reporting", value: "Yes" },
    ],
    features: [
      { title: "Financial Hub", desc: "Manage multi-currency accounting, accounts payable/receivable, and generate audit-ready financial statements." },
      { title: "Supply Chain", desc: "Optimize your warehouse, track shipments, and manage vendors with predictive AI for demand forecasting." },
      { title: "Manufacturing", desc: "Plan production schedules, manage Bills of Materials (BOM), and track shop floor progress in real-time." },
      { title: "Document Management", desc: "A centralized, secure digital vault for all corporate contracts, invoices, and employee records." },
    ],
    tech: ["Java", "Spring Boot", "Oracle DB", "Kubernetes", "Azure"],
    faq: [
      { q: "Is it suitable for small businesses?", a: "We have an 'Indux Lite' plan specifically designed for growing businesses that need ERP power without the complexity." },
      { q: "How long does implementation take?", a: "Depending on your requirements, typical rollout ranges from 4 to 12 weeks." },
    ],
  },
  {
    slug: "hrms-suite",
    title: "HRMS Suite",
    category: "Human Resources",
    shortDescription: "A digital platform to manage your entire workforce—from hiring to exit—in one place.",
    fullDescription: "HRMS Suite digitalizes the employee lifecycle. It removes the friction from HR operations, offering automated payroll, self-service leave management, and performance tracking that employees actually enjoy using.",
    themeColor: "emerald",
    iconName: "Users",
    image: "/hrms.webp",
    order: 6,
    status: "Published",
    stats: [
      { label: "Payroll Accuracy", value: "100%" },
      { label: "HR Productivity", value: "+50%" },
      { label: "Employee Sats.", value: "4.8/5" },
    ],
    features: [
      { title: "Smart Recruitment", desc: "Manage job postings, applicant tracking, and interview scheduling from a single dashboard." },
      { title: "Automated Payroll", desc: "Generate payslips, calculate tax deductions, and manage reimbursements with a single click." },
      { title: "Performance Management", desc: "Set KPIs, conduct 360-degree appraisals, and track employee growth over time." },
      { title: "Self-Service Portal", desc: "Employees can apply for leave, check payslips, and update personal info without emailing HR." },
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "AWS Lambda", "Stripe"],
    faq: [
      { q: "Does it handle compliance?", a: "Yes, it is pre-configured for standard labor laws, PF, and professional tax calculations." },
      { q: "Can it integrate with biometrics?", a: "We support integration with most major fingerprint and facial recognition hardware for attendance." },
    ],
  },
  {
    slug: "cardz365",
    title: "cardz365",
    category: "Smart Networking & AI",
    shortDescription: "A contactless digital networking ecosystem enabling instant QR card sharing, AI OCR paper card scanning, and centralized cloud contact management.",
    fullDescription: "cardz365 redefines professional networking by making business cards contactless, smart, and permanent. Users can design digital QR profile cards, scan physical paper visiting cards using AI optical character recognition (OCR) in seconds, organize contacts by company or event, and sync contacts seamlessly across devices.",
    themeColor: "indigo",
    iconName: "CreditCard",
    image: "/cardz365.webp",
    order: 7,
    status: "Published",
    stats: [
      { label: "Cards Shared", value: "85K+" },
      { label: "OCR Accuracy", value: "99.2%" },
      { label: "Paper Waste Saved", value: "95%" },
    ],
    features: [
      { title: "Contactless QR Cards", desc: "Create virtual, NFC, and dynamic QR business profiles with custom branding, social links, and contact vCard downloads." },
      { title: "AI OCR Card Scanner", desc: "Snap photos of paper business cards to instantly extract contact details, phone numbers, and addresses with 99.2% accuracy." },
      { title: "Smart Contact Organization", desc: "Tag and organize connections by company, conference, or deal stage for fast retrieval and relationship nurturing." },
      { title: "Seamless CRM & Cloud Sync", desc: "Automatically synchronize contacts across iOS, Android, and export directly to Salesforce, HubSpot, or Google Contacts." },
    ],
    tech: ["Next.js", "TypeScript", "AI OCR Engine", "Tailwind CSS", "Cloud Sync", "PostgreSQL"],
    faq: [
      { q: "Do recipients need an app to receive my card?", a: "No, anyone can view and save your cardz365 profile directly in their phone browser without installing any app." },
      { q: "Can teams and enterprises manage staff cards centrally?", a: "Yes, our Corporate Dashboard lets administrators provision branded cards, lock company templates, and revoke access upon employee exit." },
    ],
  },
  {
    slug: "indux-solar",
    title: "Indux Solar",
    category: "Clean Energy Engineering",
    shortDescription: "Turnkey commercial and industrial rooftop solar engineering solutions with intelligent generation monitoring and high ROI payback.",
    fullDescription: "Indux Solar delivers end-to-end photovoltaic rooftop solar installations for manufacturing plants, commercial complexes, and academic institutions. From structural engineering and feasibility assessments to grid-tie synchronization and live SCADA generation telemetry, we power industries sustainably.",
    themeColor: "emerald",
    iconName: "Zap",
    image: "/indux-solar.webp",
    order: 8,
    status: "Published",
    stats: [
      { label: "Solar Capacity", value: "15+ MW" },
      { label: "Commercial Leads", value: "+210%" },
      { label: "Carbon Offset", value: "18K Tons" },
    ],
    features: [
      { title: "Rooftop Engineering & EPC", desc: "Complete structural assessment, high-yield tier-1 PV panel integration, and compliant grid-tie inverter installations." },
      { title: "Intelligent ROI Calculator", desc: "Interactive financial modeling tool estimating solar power generation, monthly energy savings, and payback period within 3-4 years." },
      { title: "Live SCADA Generation Telemetry", desc: "Real-time remote cloud monitoring of power yield, inverter efficiency, string diagnostics, and automated fault alerts." },
      { title: "Government Subsidy & Net-Metering", desc: "Full liaisoning for DISCOM grid synchronization, net-metering approvals, and industrial solar subsidy processing." },
    ],
    tech: ["Solar Photovoltaics", "IoT Telemetry", "Next.js", "React", "Cloud Analytics"],
    faq: [
      { q: "What is the typical ROI on commercial solar installations?", a: "Most industrial and commercial installations break even within 3 to 4 years, delivering free green electricity for the remaining 20+ years of panel life." },
      { q: "Do you handle grid net-metering and government approvals?", a: "Yes, our engineering team manages complete state DISCOM net-metering paperwork, CEIG approvals, and commissioning end-to-end." },
    ],
  },
];

const initialRecentWorks = [
  {
    slug: "amit-mehrotra",
    title: "Amit Mehrotra",
    tagline: "Executive Coaching & Personal Transformation Platform",
    category: "Coaching & Corporate",
    image: "/recent-works/amit-mehrotra.webp",
    client: "Amit Mehrotra Coaching",
    year: "2024",
    order: 1,
    status: "Published",
    shortDescription: "A high-impact digital presence, consultation booking portal, and transformation hub for acclaimed Life Coach, NLP Trainer, and EFT Practitioner Amit Mehrotra.",
    fullDescription: "Drawing on 17 years of rich corporate leadership and 11 years of coaching with over 12,000 satisfied clients, this platform reflects authority, warmth, and results. It features seamless one-on-one consultation scheduling, corporate workshop catalogs, client transformation testimonials, and integrated communication channels.",
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
    slug: "golden-by-queen-sona",
    title: "Golden By Queen Sona",
    tagline: "Luxury Handcrafted Brass & Heritage Artifacts Store",
    category: "E-Commerce",
    image: "/recent-works/golden-by-queen-sona.webp",
    client: "DB - Golden By Queen Sona",
    year: "2024",
    order: 2,
    status: "Published",
    shortDescription: "An opulent luxury e-commerce experience showcasing timeless handcrafted stone sculptures, heritage brass idols, dhokra art, and enduring home decor.",
    fullDescription: "Crafted in stone and designed to endure, Golden By Queen Sona brings traditional Indian craft to modern luxury living. The platform combines editorial aesthetics with smooth catalog browsing, detailed artifact provenance, secure international payments, and white-glove packaging inquiries.",
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
    slug: "chetan-ply-hardware",
    title: "Chetan Ply & Hardware",
    tagline: "Architectural Interior & Trusted Plywood Solutions",
    category: "Retail & Enterprise",
    image: "/recent-works/chetan-ply-hardware.webp",
    client: "Chetan Ply & Hardware",
    year: "2024",
    order: 3,
    status: "Published",
    shortDescription: "A modern commercial showcase and material catalog connecting architects, interior designers, and homeowners with premium plywood and hardware fittings.",
    fullDescription: "Chetan Ply & Hardware provides premium timber, calibrated plywood, decorative veneers, and designer hardware fittings for contemporary living spaces. The platform serves as a virtual showroom where trade professionals and residential clients can explore wood grades, inspect finishes, and request project quotes.",
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
    slug: "evoke-technologies",
    title: "Evoke Technologies",
    tagline: "Your Digital Transformation Partner & Enterprise Resource Hub",
    category: "IT & Digital Transformation",
    image: "/recent-works/evoke-technologies.webp",
    client: "Evoke Technologies",
    year: "2024",
    order: 4,
    status: "Published",
    shortDescription: "A high-performance digital transformation portal, enterprise knowledge base, and resource hub accelerating modern business agility and cloud adoption.",
    fullDescription: "Evoke Technologies empowers global enterprises with software innovation, digital modernization, and enterprise cloud solutions. The platform features an extensive digital resource center with downloadable whitepapers, case studies across diverse industries, technology radar insights, and high-conversion B2B consultation funnels.",
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
    slug: "megabyte-systems",
    title: "Megabyte Systems",
    tagline: "Enterprise IT Solutions, System Integration & Hardware Infrastructure",
    category: "IT & Digital Transformation",
    image: "/recent-works/megabyte-systems.webp",
    client: "Megabyte Systems",
    year: "2024",
    order: 5,
    status: "Published",
    shortDescription: "A comprehensive IT infrastructure and hardware solutions portal offering server integration, networking, enterprise storage, and AMC support.",
    fullDescription: "Megabyte Systems delivers enterprise IT excellence through end-to-end server deployments, workstation provisioning, business software integration, and data storage. The web portal features an interactive enterprise hardware catalog, custom server configuration quotes, and rapid maintenance ticketing.",
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
    slug: "neptune",
    title: "Neptune",
    tagline: "Luxury Outdoor & Terrace Living Furniture & Green Landscaping",
    category: "Retail & Enterprise",
    image: "/recent-works/neptune-luxury-living.webp",
    client: "Neptune Luxury Living",
    year: "2024",
    order: 6,
    status: "Published",
    shortDescription: "An immersive luxury outdoor furniture and terrace landscaping portal where modern architectural design harmonizes with lush botanical serenity.",
    fullDescription: "Neptune curates high-end terrace lounges, weather-resilient patio seating, architectural planters, and landscape installations for upscale villas and boutique hospitality resorts. The digital experience offers visual moodboards, material durability guides, and bespoke architectural landscape design consultations.",
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
    slug: "pic-power",
    title: "PIC POWER",
    tagline: "High-Performance Batteries & Advanced Energy Storage Solutions",
    category: "Clean Energy & Industrial",
    image: "/recent-works/pic-power.webp",
    client: "PIC POWER Energy Systems",
    year: "2024",
    order: 7,
    status: "Published",
    shortDescription: "A high-capacity battery and power storage marketplace catering to electric two-wheelers, home inverters, solar setups, and commercial backups.",
    fullDescription: "Powering your world one charge at a time, PIC POWER specializes in heavy-duty inverter batteries, long-range EV batteries, and solar energy storage units. The platform features an intelligent battery finder by vehicle or appliance model, warranty registration, battery health calculators, and authorized dealer locator.",
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
    slug: "progro",
    title: "PROGRO",
    tagline: "Growing Wealth, Creating Journeys - Next-Gen FinTech Platform",
    category: "SaaS & FinTech",
    image: "/recent-works/progro.webp",
    client: "PROGRO Wealth Technologies",
    year: "2024",
    order: 8,
    status: "Published",
    shortDescription: "A cutting-edge wealth management and investment acceleration platform designed to empower individuals and family offices with intelligent portfolio journeys.",
    fullDescription: "PROGRO represents the future of personal and institutional wealth accumulation. Under the mantra 'Your future wealth begins here', the platform combines goal-based financial roadmapping, algorithmic portfolio rebalancing, alternative asset tracking, and intuitive wealth journey milestones.",
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
    slug: "pic-power-grid-storage",
    title: "PIC POWER Grid Storage",
    tagline: "Large-Scale Sustainable Solutions & Containerized Battery Storage",
    category: "Clean Energy & Industrial",
    image: "/recent-works/pic-power-storage.webp",
    client: "PIC POWER Industrial Solutions",
    year: "2024",
    order: 9,
    status: "Published",
    shortDescription: "Transforming industrial energy landscapes with utility-scale wind and solar grid integration and megawatt-capacity containerized energy storage systems (BESS).",
    fullDescription: "PIC POWER's industrial division engineers megawatt-class containerized energy storage units for utility grids, solar farms, and heavy manufacturing facilities. The platform features an interactive BESS configurator, hybrid renewable grid simulation, load-shifting analytics, and enterprise quotation request funnels.",
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
    slug: "saylo-foods",
    title: "Saylo Pvt. Ltd.",
    tagline: "Taste the Heart of India - Authentic Atta, Crispy Chivda & Wholesome Dals",
    category: "E-Commerce",
    image: "/recent-works/saylo-foods.webp",
    client: "Saylo Foods Pvt. Ltd.",
    year: "2024",
    order: 10,
    status: "Published",
    shortDescription: "A vibrant FMCG food portal bringing farm-pure stone-ground atta, artisanal chivda snacks, and unpolished pulses to dining tables across the nation.",
    fullDescription: "Celebrating authentic regional culinary traditions, Saylo Pvt. Ltd. delivers staple kitchen essentials and savory treats straight from the heartlands of India. The platform features direct-to-consumer online ordering, wholesale distributor inquiry portals, regional flavor showcases, and farm-to-table purity verifications.",
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
    slug: "shlok-food-lab",
    title: "Shlok Food Lab (SFL)",
    tagline: "State-of-the-Art Food Testing, R&D & Quality Certification Facility",
    category: "Retail & Enterprise",
    image: "/recent-works/shlok-food-lab.webp",
    client: "Shlok Food Lab & Research",
    year: "2024",
    order: 11,
    status: "Published",
    shortDescription: "An advanced food laboratory and research facility portal in Chhatrapati Sambhajinagar providing scientific testing, FSSAI compliance, and sensory R&D.",
    fullDescription: "Located in Chhatrapati Sambhajinagar, Maharashtra, Shlok Food Lab (SFL) operates advanced chromatographic and microbiological testing for food manufacturers, exporters, and agricultural producers. The web portal features online test sample booking, digital report downloads, regulatory compliance checklists, and virtual laboratory tours.",
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


const connectMongo = async (uri: string) => {
  try {
    return await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
  } catch (err: any) {
    if (err?.code === "ETIMEOUT" || err?.syscall === "querySrv") {
      console.log("System DNS SRV resolution timed out. Trying alternative DNS (1.1.1.1, 8.8.8.8)...");
      try {
        dns.setServers(["1.1.1.1", "8.8.8.8"]);
        return await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
      } catch (err2: any) {
        console.log("SRV DNS still failing. Connecting via direct MongoDB cluster shard hosts...");
        const directUri = uri
          .replace("mongodb+srv://", "mongodb://")
          .replace(
            "@cluster0.mvvnttf.mongodb.net",
            "@ac-y0lujk9-shard-00-00.mvvnttf.mongodb.net:27017,ac-y0lujk9-shard-00-01.mvvnttf.mongodb.net:27017,ac-y0lujk9-shard-00-02.mvvnttf.mongodb.net:27017"
          ) + (uri.includes("?") ? "&ssl=true&authSource=admin" : "?ssl=true&authSource=admin");

        return await mongoose.connect(directUri, { serverSelectionTimeoutMS: 10000 });
      }
    }
    throw err;
  }
};

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/indux-technology";
    await connectMongo(mongoUri);
    console.log("Connected to MongoDB successfully");

    // Upsert products
    for (const prod of initialProducts) {
      await Product.findOneAndUpdate({ slug: prod.slug }, prod, { upsert: true, new: true });
      console.log(`Product seeded/synced: ${prod.title}`);
    }

    // Upsert recent works
    for (const work of initialRecentWorks) {
      await RecentWork.findOneAndUpdate({ slug: work.slug }, work, { upsert: true, new: true });
      console.log(`Recent Work seeded/synced: ${work.title}`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
