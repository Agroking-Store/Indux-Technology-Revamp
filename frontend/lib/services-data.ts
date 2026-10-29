export interface ServiceOffer {
  id: string;
  slug: string;
  title: string;
  headline: string;
  promise: string;
  bestFor?: string;
  includes: string[];
  summary: string;
  badge: string;
  image: string;
}

export const servicesData: Record<string, ServiceOffer> = {
  crm: {
    id: "crm",
    slug: "crm",
    title: "Custom CRM Development",
    headline: "CRM Solutions Redefined",
    promise: "Never lose a lead or forget a follow-up again.",
    bestFor: "Sales teams, agencies, educators, real estate and service businesses.",
    includes: [
      "Lead and contact management",
      "Pipeline stages",
      "Reminders",
      "WhatsApp and email integration",
      "Reports and dashboards",
      "User roles and permissions",
    ],
    summary:
      "Indux Technology builds custom CRM software for businesses in Pune and across India. We develop CRM systems for lead management, sales pipelines, customer management, workflow automation, analytics, WhatsApp integration, and business operations.",
    badge: "Custom CRM Development",
    image: "/services/crm.webp",
  },
  erp: {
    id: "erp",
    slug: "erp",
    title: "Manufacturing ERP",
    headline: "ERP Systems Unified",
    promise: "See inventory, orders and production in one system.",
    bestFor: "Small and mid-size manufacturers and distributors.",
    includes: [
      "Inventory and purchasing",
      "Production tracking",
      "Sales and billing",
      "Vendor management",
      "Management reports",
    ],
    summary:
      "We architect, integrate, and deploy robust Enterprise Resource Planning solutions that streamline operations, centralize data, and drive unprecedented business efficiency.",
    badge: "Manufacturing ERP",
    image: "/services/erp.webp",
  },
  automation: {
    id: "automation",
    slug: "automation",
    title: "Sales Automation",
    headline: "Sales & Business Automation",
    promise: "Let software handle the repetitive work so your team can sell.",
    bestFor: "Growing businesses, sales teams, and operations looking to eliminate manual busywork.",
    includes: [
      "Automated follow-ups",
      "Lead assignment",
      "Quotation and proposal workflows",
      "Performance reporting",
    ],
    summary:
      "Eliminate manual data entry and routine busywork. Our automation engineers integrate webhook pipelines, background workers, and trigger-based notifications so your team can focus on closing deals.",
    badge: "Sales Automation",
    image: "/services/sales-automation.webp",
  },
  webDev: {
    id: "web-dev",
    slug: "web-dev",
    title: "Web and Mobile App Development",
    headline: "Web & App Engineering",
    promise: "Fast, secure apps built to scale with your customers.",
    bestFor: "Enterprises, startups, e-commerce brands, and digital businesses.",
    includes: [
      "Websites and web apps (React, Next.js, Node.js, MongoDB)",
      "E-commerce",
      "Admin panels",
      "Mobile apps",
    ],
    summary:
      "We engineer performant web applications, custom digital portals, and scalable cloud architectures designed for responsiveness, search engine dominance, and high conversion.",
    badge: "Web Development",
    image: "/services/web-dev.webp",
  },
  mobileDev: {
    id: "mobile-dev",
    slug: "mobile-dev",
    title: "Web and Mobile App Development",
    headline: "Mobile App Engineering",
    promise: "Fast, secure apps built to scale with your customers.",
    bestFor: "Consumer brands, SaaS products, on-demand services, and enterprise workforces.",
    includes: [
      "Websites and web apps (React, Next.js, Node.js, MongoDB)",
      "E-commerce",
      "Admin panels",
      "Mobile apps",
    ],
    summary:
      "High-performance iOS and Android mobile applications designed with fluid UI, offline-first reliability, push telemetry, and frictionless user flows.",
    badge: "Mobile App Development",
    image: "/services/mobile-app.webp",
  },
  aiChatbots: {
    id: "ai-chatbots",
    slug: "ai-chatbots",
    title: "AI Automation",
    headline: "AI Solutions & Automation",
    promise: "Use AI where it saves real time and money.",
    bestFor: "Support teams, knowledge workforces, data operations, and automated customer service.",
    includes: [
      "Workflow automation",
      "AI chat and assistants",
      "Document and data processing",
      "Reporting automation",
    ],
    summary:
      "Pragmatic, high-ROI AI integrations tailored to your proprietary knowledge base. Build generative assistants, automated document parsers, and smart workflow triggers.",
    badge: "AI Automation",
    image: "/images/unsplash/ai-solutions.webp",
  },
};
