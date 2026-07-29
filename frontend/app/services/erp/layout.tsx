import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise ERP Software Development Services | Indux Technology",
  description: "Streamline business operations with custom manufacturing & enterprise ERP systems. Indux Technology in Pune builds scalable ERP solutions for inventory, finance, and workflow automation.",
  alternates: {
    canonical: "https://induxtechnology.com/services/erp",
  },
};

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Enterprise ERP Systems Development",
    "description": "Custom enterprise resource planning software to break down data silos, manage inventory control, financial ledger automation, and business intelligence reporting.",
    "provider": {
      "@type": "Organization",
      "name": "Indux Technology",
      "url": "https://induxtechnology.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": "ERP Software Development"
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
