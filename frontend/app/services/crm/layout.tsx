import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom CRM Software Development Company | Indux Technology",
  description: "Transform your client relationships with custom CRM development services from Indux Technology in Pune, India. We configure, implement, and automate HubSpot, Salesforce, and bespoke CRM platforms.",
  alternates: {
    canonical: "https://induxtechnology.com/services/crm",
  },
};

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Custom CRM Development Solutions",
    "description": "Bespoke customer relationship management systems built from the ground up to match your unique business workflows, data migration, and sales automation requirements.",
    "provider": {
      "@type": "Organization",
      "name": "Indux Technology",
      "url": "https://induxtechnology.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": "CRM Software Development"
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
