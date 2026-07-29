import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Process Automation & Workflows | Indux Technology",
  description: "Automate repetitive tasks and scale operations. Indux Technology in Pune provides custom sales automation, WhatsApp APIs, scraper integrations, and data synchronization.",
  alternates: {
    canonical: "https://induxtechnology.com/services/automation",
  },
};

export default function AutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Business Process Automation & Integration Solutions",
    "description": "Streamlining administrative, sales, and backend processes using secure API integrations, web scrapers, WhatsApp automation, and custom scheduling workers.",
    "provider": {
      "@type": "Organization",
      "name": "Indux Technology",
      "url": "https://induxtechnology.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": "Business Process Automation"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
