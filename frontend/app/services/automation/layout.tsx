import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Process Automation Company in Pune | Indux Technology",
  description:
    "Indux Technology provides business process automation, workflow automation, WhatsApp automation, API integrations, web scraping, and custom automation solutions for businesses in Pune and across India.",
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
    name: "Business Process Automation & Integration Solutions",
    description:
      "Custom business process automation using API integrations, workflow automation, WhatsApp automation, web scraping, and backend integrations.",
    provider: {
      "@type": "Organization",
      name: "Indux Technology",
      url: "https://induxtechnology.com",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: "Business Process Automation",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      {children}
    </>
  );
}