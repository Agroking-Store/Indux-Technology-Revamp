import {
  Sparkles,
  Sprout,
  ShieldCheck,
  BarChart3,
  Building2,
  CreditCard,
  Scale,
  Users,
  LucideIcon,
  Zap,
} from "lucide-react";

export interface Project {
  id: number;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  themeColor: "blue" | "emerald" | "cyan" | "indigo";
  icon: LucideIcon;
  image: string;
  features: string[];
  benefits: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Indux CRM",
    category: "Business Intelligence",
    shortDescription:
      "Empower your business with a centralized CRM system to manage leads and automate workflows.",
    fullDescription:
      "Indux CRM helps you track leads, improve customer engagement, and boost overall productivity. It centralizes all customer information in one secure platform, allowing you to monitor sales performance with powerful reports and analytics. Spend less time managing data and more time growing your business with our smart dashboard and automated task scheduling.",
    themeColor: "blue",
    icon: Sparkles,
    image: "/induxcrm.webp",
    features: [
      "Lead Management & Sales Pipeline",
      "Automated Workflows & Task Scheduling",
      "Real-time Analytics & Insights",
      "Secure Cloud Access",
    ],
    benefits: [
      "Improve Sales Productivity",
      "Reduce Manual Work",
      "Faster Lead Conversion",
      "Better Customer Relationships",
    ],
  },
  {
    id: 2,
    title: "Bill Tea",
    category: "Retail Management",
    shortDescription:
      "Simplifying Retail Business Management with GST-compliant billing and real-time inventory.",
    fullDescription:
      "BillTea combines every essential retail operation into one easy-to-use platform. Managing billing, inventory, and quotations shouldn't slow your business down. From hardware stores to interior dealers, BillTea helps reduce errors, automate calculations, and provides smart business insights through powerful reporting.",
    themeColor: "emerald",
    icon: Sprout,
    image: "/billtea.webp",
    features: [
      "GST-Compliant Invoice Management",
      "Real-time Inventory Tracking",
      "Quotation & Purchase Management",
      "Payment Tracking & Reminders",
    ],
    benefits: [
      "Significantly Faster Billing",
      "Fewer Calculation Errors",
      "Secure Data Protection",
      "Better Inventory Control",
    ],
  },
  {
    id: 3,
    title: "JEM Soft",
    category: "Insurance ERP",
    shortDescription:
      "A centralized Insurance Management System designed for LIC agents and financial advisors.",
    fullDescription:
      "JEM Soft consolidates scattered agent workflows into a single web-based platform. Designed for LIC agents and investment professionals, it supports the complete policy lifecycle, commission tracking, and pre-sales presentations. It replaces manual registers and spreadsheets with a role-based secure system.",
    themeColor: "indigo",
    icon: ShieldCheck,
    image: "/jemsoft.webp",
    features: [
      "Complete Policy Lifecycle Management",
      "LIC Pre-Sales & Presentation Tools",
      "Commission Tracking & Reports",
      "Consolidated Customer View",
    ],
    benefits: [
      "Eliminate Data Silos",
      "Role-based Secure Access",
      "Faster Decision Making",
      "Scalable Multi-branch Support",
    ],
  },
  {
    id: 4,
    title: "Sales Automation",
    category: "AI Marketing",
    shortDescription:
      "Automate customer leads, follow-up emails, and WhatsApp communication from one place.",
    fullDescription:
      "Reduce manual work by automatically sending personalized follow-up sequences. This platform manages leads throughout the sales process, tracks email engagement, and enables seamless WhatsApp Business communication with optional AI assistance to answer customer questions 24/7.",
    themeColor: "cyan",
    icon: Zap,
    image: "/salesautomation.webp",
    features: [
      "Automated 48-hour Email Sequences",
      "WhatsApp Business AI Assistant",
      "Campaign & Lead Management",
      "Email Tracking & Analytics",
    ],
    benefits: [
      "Shorter Sales Cycles",
      "Improved Engagement Rates",
      "Elimination of Busywork",
      "24/7 Customer Interaction",
    ],
  },
  {
    id: 5,
    title: "Indux ERP",
    category: "Enterprise Operations",
    shortDescription:
      "Streamline core business processes from finance to operations in one unified platform.",
    fullDescription:
      "Indux ERP integrates all business operations including finance, inventory, HR, and sales. It enables data-driven decision-making through real-time reporting and GST-ready modules. Built for scalability, it connects every department while maintaining enterprise-grade security and role-based access.",
    themeColor: "blue",
    icon: BarChart3,
    image: "/indux_erp.webp",
    features: [
      "Integrated Finance & Accounting",
      "Inventory & Supply Chain Optimization",
      "GST Ready & Custom Reports",
      "Approval & Document Management",
    ],
    benefits: [
      "Optimized Resource Usage",
      "Improved Operational Efficiency",
      "Enterprise-grade Data Security",
      "Multi-user Access Control",
    ],
  },
  {
    id: 6,
    title: "HRMS Suite",
    category: "Human Resources",
    shortDescription:
      "A digital platform to manage your entire workforce—from hiring to exit—in one place.",
    fullDescription:
      "The HRMS digitalizes every HR process, eliminating paperwork and providing dedicated role-based workspaces. From recruitment and payroll generation to attendance and appraisals, it provides a complete digital document locker and automated approval workflows for modern organizations.",
    themeColor: "emerald",
    icon: Users,
    image: "/hrms.webp",
    features: [
      "Recruitment & Exit Management",
      "Payroll & Payslip Generation",
      "Attendance & Shift Management",
      "Audit Logs & Compliance Tracking",
    ],
    benefits: [
      "Zero Calculation Errors",
      "Reduced HR Workload",
      "Centralized Document Storage",
      "Transparent Appraisals",
    ],
  },
  {
    id: 7,
    title: "Indux Properties",
    category: "Real Estate",
    shortDescription:
      "Intelligent property management for landlords and real estate agencies.",
    fullDescription:
      "Indux Properties simplifies the management of residential and commercial portfolios. Track tenant history, manage maintenance requests, and automate rent collection. Our platform provides digital lease signing and automated vacancy marketing to ensure your investment is always performing at its peak.",
    themeColor: "indigo",
    icon: Building2,
    image:
      "/images/unsplash/img-f91f9eed.webp",
    features: [
      "Digital Lease Management",
      "Automated Rent Collection",
      "Maintenance Request Portal",
      "Tenant Screening & History",
    ],
    benefits: [
      "Increased Occupancy Rates",
      "Reduced Administrative Overhead",
      "Legal Compliance Management",
      "Better Landlord-Tenant Relations",
    ],
  },
  {
    id: 8,
    title: "Card 360",
    category: "Fintech",
    shortDescription:
      "Secure card management and digital payment gateway for modern finance.",
    fullDescription:
      "Card 360 offers a bank-grade infrastructure for managing corporate cards and digital transactions. Monitor spending in real-time, set granular card limits, and benefit from advanced fraud detection algorithms. It bridges the gap between traditional banking and digital-first financial management.",
    themeColor: "cyan",
    icon: CreditCard,
    image:
      "/images/unsplash/img-1a772fb8.webp",
    features: [
      "Real-time Spend Tracking",
      "Instant Card Issuance",
      "Advanced Fraud Prevention",
      "Multi-currency Support",
    ],
    benefits: [
      "Complete Financial Control",
      "Reduced Chargeback Risks",
      "Streamlined Expense Filing",
      "Secure Transaction Processing",
    ],
  },
  {
    id: 9,
    title: "Dnyaypath",
    category: "Legal ERP",
    shortDescription:
      "Comprehensive legal practice management for advocates and law firms.",
    fullDescription:
      "Dnyaypath is designed specifically for the legal fraternity to automate case tracking and client communications. Securely store case documents in an encrypted vault, manage billable hours, and ensure you never miss a hearing date with our automated judicial calendar synchronization.",
    themeColor: "blue",
    icon: Scale,
    image:
      "/images/unsplash/img-01c6a0f0.webp",
    features: [
      "Automated Case Tracking",
      "Encrypted Document Vault",
      "Billable Hour Management",
      "Judicial Calendar Sync",
    ],
    benefits: [
      "Never Miss a Hearing",
      "Organized Client Records",
      "Transparent Legal Billing",
      "Secure Confidential Storage",
    ],
  },
];
