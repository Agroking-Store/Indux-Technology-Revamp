import {
  Sparkles,
  Sprout,
  ShieldCheck,
  BarChart3,
  Building2,
  CreditCard,
  Scale,
  Users,
  Zap,
  Sun,
} from "lucide-react";

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  themeColor: "blue" | "emerald" | "cyan" | "indigo";
  icon: any;
  image: string;
  features: { title: string; desc: string }[];
  stats: { label: string; value: string }[];
  faq: { q: string; a: string }[];
  tech: string[];
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "indux-crm",
    title: "Indux CRM",
    category: "Business Intelligence",
    shortDescription:
      "Manage leads, customer relationships, sales activities, and follow-ups with custom CRM software designed around your business workflows.",
    fullDescription:
      "Indux CRM is an enterprise-grade solution designed to unify your sales, marketing, and support teams. By centralizing customer data, it eliminates silos and provides a 360-degree view of your customer journey, allowing for data-driven decisions at every level of your organization.",
    themeColor: "blue",
    icon: Sparkles,
    image: "/indux-dashboard.png",
    stats: [
      { label: "Sales Growth", value: "+35%" },
      { label: "Lead Conversion", value: "3x Faster" },
      { label: "User Adoption", value: "98%" },
    ],
    features: [
      {
        title: "Lead Management",
        desc: "Capture leads automatically from web forms, emails, and social media. Use intelligent scoring to prioritize high-value prospects.",
      },
      {
        title: "Sales Pipeline",
        desc: "Visualize your sales funnel with customizable stages. Drag and drop deals to update status and trigger automated follow-ups.",
      },
      {
        title: "Automated Workflows",
        desc: "Eliminate manual data entry by setting up trigger-based actions for email sequences, task assignments, and record updates.",
      },
      {
        title: "Advanced Analytics",
        desc: "Generate complex reports on team performance, conversion rates, and revenue forecasting with beautiful, interactive dashboards.",
      },
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "AWS S3", "Redis"],
    faq: [
      {
        q: "Is Indux CRM cloud-based?",
        a: "Yes, it is a fully managed cloud solution accessible from any device, anywhere in the world.",
      },
      {
        q: "Can we migrate data from Excel?",
        a: "Absolutely. We provide robust import tools and mapping services to bring your legacy data into Indux CRM seamlessly.",
      },
    ],
  },
  {
    id: 2,
    slug: "bill-tea",
    title: "Bill Tea",
    category: "Retail Management",
    shortDescription:
      "Simplifying Retail Business Management with GST-compliant billing and real-time inventory.",
    fullDescription:
      "Bill Tea is the ultimate tool for modern retailers. It handles the complexities of GST, inventory tracking, and purchase management, allowing you to focus on serving your customers. Designed for speed and accuracy in high-traffic retail environments.",
    themeColor: "emerald",
    icon: Sprout,
    image: "/billtea.webp",
    stats: [
      { label: "Billing Speed", value: "-60%" },
      { label: "Inventory Error", value: "0%" },
      { label: "Compliance", value: "100%" },
    ],
    features: [
      {
        title: "GST Billing",
        desc: "Generate professional, GST-compliant invoices in seconds. Supports HSN codes, multi-tax rates, and digital signatures.",
      },
      {
        title: "Stock Tracking",
        desc: "Real-time inventory updates as you sell. Get low-stock alerts and manage supplier orders from a single screen.",
      },
      {
        title: "Barcode Integration",
        desc: "Speed up your checkout process with seamless barcode scanning and label printing support.",
      },
      {
        title: "Customer Loyalty",
        desc: "Track purchase history and reward your frequent shoppers with automated points and discount programs.",
      },
    ],
    tech: ["React", "Express.js", "MongoDB", "Socket.io", "Electron"],
    faq: [
      {
        q: "Does it work offline?",
        a: "Yes, Bill Tea has a robust offline mode that syncs your data once you're back online.",
      },
      {
        q: "Can I manage multiple stores?",
        a: "Our Enterprise plan supports multi-location syncing and centralized inventory management.",
      },
    ],
  },
  {
    id: 3,
    slug: "jem-soft",
    title: "JEM Soft",
    category: "Insurance ERP",
    shortDescription:
      "A centralized Insurance Management System designed for LIC agents and financial advisors.",
    fullDescription:
      "JEM Soft bridges the gap between traditional insurance sales and digital efficiency. It empowers financial advisors to manage their entire portfolio, track commissions, and deliver professional presentations to clients, all from one secure web portal.",
    themeColor: "indigo",
    icon: ShieldCheck,
    image: "/jem-dashboard.png",
    stats: [
      { label: "Policy Retention", value: "+25%" },
      { label: "Admin Time", value: "-15hrs/wk" },
      { label: "Data Security", value: "Bank-Grade" },
    ],
    features: [
      {
        title: "Policy Lifecycle",
        desc: "Track every policy from application to maturity. Automated reminders for premium due dates and renewals.",
      },
      {
        title: "Commission Tracker",
        desc: "Automatically calculate and track your commissions across different products and carriers.",
      },
      {
        title: "Client Portals",
        desc: "Allow your clients to log in and view their investment summary, download receipts, and request support.",
      },
      {
        title: "Plan Presentations",
        desc: "Generate beautiful, easy-to-understand insurance illustrations and financial plans for your prospects.",
      },
    ],
    tech: ["TypeScript", "NestJS", "PostgreSQL", "Docker", "DigitalOcean"],
    faq: [
      {
        q: "Is client data kept private?",
        a: "Data privacy is our top priority. We use role-based access control and end-to-end encryption for all sensitive client records.",
      },
      {
        q: "Does it support LIC plans?",
        a: "Yes, JEM Soft is specifically updated monthly with the latest LIC plan parameters and calculation logic.",
      },
    ],
  },
  {
    id: 4,
    slug: "sales-automation",
    title: "Sales Automation",
    category: "AI Marketing",
    shortDescription:
      "Automate customer leads, follow-up emails, and WhatsApp communication from one place.",
    fullDescription:
      "Stop letting leads fall through the cracks. Our Sales Automation suite uses AI to handle the first 48 hours of lead engagement, ensuring every prospect gets a response, even while your team sleeps.",
    themeColor: "cyan",
    icon: Zap,
    image: "/salesautomation.webp",
    stats: [
      { label: "Response Rate", value: "100%" },
      { label: "Engagement", value: "+80%" },
      { label: "AI Accuracy", value: "94%" },
    ],
    features: [
      {
        title: "Email Sequences",
        desc: "Create multi-day automated email drips that stop once a user replies. Personalized using dynamic tags.",
      },
      {
        title: "WhatsApp AI",
        desc: "Deploy a WhatsApp bot that can answer common questions about your products and schedule meetings 24/7.",
      },
      {
        title: "Lead Scoring",
        desc: "Automatically rank leads based on their interactions with your emails and website.",
      },
      {
        title: "Calendar Sync",
        desc: "Integrate with Google or Outlook to allow leads to book demos directly into your sales team's schedule.",
      },
    ],
    tech: ["Python", "FastAPI", "OpenAI API", "PostgreSQL", "Twilio"],
    faq: [
      {
        q: "Will the AI sound robotic?",
        a: "No, we use advanced LLMs trained on your specific business tone to ensure natural, helpful conversations.",
      },
      {
        q: "Can I monitor the bot?",
        a: "Absolutely. You can take over any live conversation at any time from the dashboard.",
      },
    ],
  },
  {
    id: 5,
    slug: "indux-erp",
    title: "Indux ERP",
    category: "Enterprise Operations",
    shortDescription:
      "Streamline core business processes from finance to operations in one unified platform.",
    fullDescription:
      "Indux ERP is a comprehensive suite that manages every aspect of your enterprise. From supply chain and procurement to financial consolidation and HR, it provides the single source of truth required for large-scale operations.",
    themeColor: "blue",
    icon: BarChart3,
    image: "/induxerp-dashboard.png",
    stats: [
      { label: "Op. Efficiency", value: "+40%" },
      { label: "Overhead Cost", value: "-20%" },
      { label: "Real-time Reporting", value: "Yes" },
    ],
    features: [
      {
        title: "Financial Hub",
        desc: "Manage multi-currency accounting, accounts payable/receivable, and generate audit-ready financial statements.",
      },
      {
        title: "Supply Chain",
        desc: "Optimize your warehouse, track shipments, and manage vendors with predictive AI for demand forecasting.",
      },
      {
        title: "Manufacturing",
        desc: "Plan production schedules, manage Bills of Materials (BOM), and track shop floor progress in real-time.",
      },
      {
        title: "Document Management",
        desc: "A centralized, secure digital vault for all corporate contracts, invoices, and employee records.",
      },
    ],
    tech: ["Java", "Spring Boot", "Oracle DB", "Kubernetes", "Azure"],
    faq: [
      {
        q: "Is it suitable for small businesses?",
        a: "We have an 'Indux Lite' plan specifically designed for growing businesses that need ERP power without the complexity.",
      },
      {
        q: "How long does implementation take?",
        a: "Depending on your requirements, typical rollout ranges from 4 to 12 weeks.",
      },
    ],
  },
  {
    id: 6,
    slug: "hrms-suite",
    title: "HRMS Suite",
    category: "Human Resources",
    shortDescription:
      "A digital platform to manage your entire workforce—from hiring to exit—in one place.",
    fullDescription:
      "HRMS Suite digitalizes the employee lifecycle. It removes the friction from HR operations, offering automated payroll, self-service leave management, and performance tracking that employees actually enjoy using.",
    themeColor: "emerald",
    icon: Users,
    image: "/hrms-dashboard.png",
    stats: [
      { label: "Payroll Accuracy", value: "100%" },
      { label: "HR Productivity", value: "+50%" },
      { label: "Employee Sats.", value: "4.8/5" },
    ],
    features: [
      {
        title: "Smart Recruitment",
        desc: "Manage job postings, applicant tracking, and interview scheduling from a single dashboard.",
      },
      {
        title: "Automated Payroll",
        desc: "Generate payslips, calculate tax deductions, and manage reimbursements with a single click.",
      },
      {
        title: "Performance Management",
        desc: "Set KPIs, conduct 360-degree appraisals, and track employee growth over time.",
      },
      {
        title: "Self-Service Portal",
        desc: "Employees can apply for leave, check payslips, and update personal info without emailing HR.",
      },
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "AWS Lambda", "Stripe"],
    faq: [
      {
        q: "Does it handle compliance?",
        a: "Yes, it is pre-configured for standard labor laws, PF, and professional tax calculations.",
      },
      {
        q: "Can it integrate with biometrics?",
        a: "We support integration with most major fingerprint and facial recognition hardware for attendance.",
      },
    ],
  },
  {
    id: 7,
    slug: "cardz365",
    title: "cardz365",
    category: "Smart Networking & AI",
    shortDescription:
      "A contactless digital networking ecosystem enabling instant QR card sharing, AI OCR paper card scanning, and centralized cloud contact management.",
    fullDescription:
      "cardz365 redefines professional networking by making business cards contactless, smart, and permanent. Users can design digital QR profile cards, scan physical paper visiting cards using AI optical character recognition (OCR) in seconds, organize contacts by company or event, and sync contacts seamlessly across devices.",
    themeColor: "indigo",
    icon: CreditCard,
    image: "/cardz365.webp",
    stats: [
      { label: "Cards Shared", value: "85K+" },
      { label: "OCR Accuracy", value: "99.2%" },
      { label: "Paper Waste Saved", value: "95%" },
    ],
    features: [
      {
        title: "Contactless QR Cards",
        desc: "Create virtual, NFC, and dynamic QR business profiles with custom branding, social links, and contact vCard downloads.",
      },
      {
        title: "AI OCR Card Scanner",
        desc: "Snap photos of paper business cards to instantly extract contact details, phone numbers, and addresses with 99.2% accuracy.",
      },
      {
        title: "Smart Contact Organization",
        desc: "Tag and organize connections by company, conference, or deal stage for fast retrieval and relationship nurturing.",
      },
      {
        title: "Seamless CRM & Cloud Sync",
        desc: "Automatically synchronize contacts across iOS, Android, and export directly to Salesforce, HubSpot, or Google Contacts.",
      },
    ],
    tech: ["Next.js", "TypeScript", "AI OCR Engine", "Tailwind CSS", "Cloud Sync", "PostgreSQL"],
    faq: [
      {
        q: "Do recipients need an app to receive my card?",
        a: "No, anyone can view and save your cardz365 profile directly in their phone browser without installing any app.",
      },
      {
        q: "Can teams and enterprises manage staff cards centrally?",
        a: "Yes, our Corporate Dashboard lets administrators provision branded cards, lock company templates, and revoke access upon employee exit.",
      },
    ],
  },
  {
    id: 8,
    slug: "indux-solar",
    title: "Indux Solar",
    category: "Clean Energy Engineering",
    shortDescription:
      "Turnkey commercial and industrial rooftop solar engineering solutions with intelligent generation monitoring and high ROI payback.",
    fullDescription:
      "Indux Solar delivers end-to-end photovoltaic rooftop solar installations for manufacturing plants, commercial complexes, and academic institutions. From structural engineering and feasibility assessments to grid-tie synchronization and live SCADA generation telemetry, we power industries sustainably.",
    themeColor: "emerald",
    icon: Sun,
    image: "/indux-solar.jpg",
    stats: [
      { label: "Solar Capacity", value: "15+ MW" },
      { label: "Commercial Leads", value: "+210%" },
      { label: "Carbon Offset", value: "18K Tons" },
    ],
    features: [
      {
        title: "Rooftop Engineering & EPC",
        desc: "Complete structural assessment, high-yield tier-1 PV panel integration, and compliant grid-tie inverter installations.",
      },
      {
        title: "Intelligent ROI Calculator",
        desc: "Interactive financial modeling tool estimating solar power generation, monthly energy savings, and payback period within 3-4 years.",
      },
      {
        title: "Live SCADA Generation Telemetry",
        desc: "Real-time remote cloud monitoring of power yield, inverter efficiency, string diagnostics, and automated fault alerts.",
      },
      {
        title: "Government Subsidy & Net-Metering",
        desc: "Full liaisoning for DISCOM grid synchronization, net-metering approvals, and industrial solar subsidy processing.",
      },
    ],
    tech: ["Solar Photovoltaics", "IoT Telemetry", "Next.js", "React", "Cloud Analytics"],
    faq: [
      {
        q: "What is the typical ROI on commercial solar installations?",
        a: "Most industrial and commercial installations break even within 3 to 4 years, delivering free green electricity for the remaining 20+ years of panel life.",
      },
      {
        q: "Do you handle grid net-metering and government approvals?",
        a: "Yes, our engineering team manages complete state DISCOM net-metering paperwork, CEIG approvals, and commissioning end-to-end.",
      },
    ],
  },
];
