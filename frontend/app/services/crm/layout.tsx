import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom CRM Software Development | Indux Technology",
  description: "Manage leads, customer relationships, sales activities, and follow-ups with custom CRM software designed around your business workflows.",
  alternates: {
    canonical: "https://induxtechnology.com/services/crm",
  },
  openGraph: {
    title: "Custom CRM Software Development | Indux Technology",
    description: "Manage leads, customer relationships, sales activities, and follow-ups with custom CRM software designed around your business workflows.",
    url: "https://induxtechnology.com/services/crm",
  },
  twitter: {
    title: "Custom CRM Software Development | Indux Technology",
    description: "Manage leads, customer relationships, sales activities, and follow-ups with custom CRM software designed around your business workflows.",
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
