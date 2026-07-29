import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Web Development & SaaS Application Company | Indux Technology",
  description: "Get high-performance, modern, and responsive websites & web applications. Indux Technology in Pune provides custom front-end, back-end, and SaaS development services.",
  alternates: {
    canonical: "https://induxtechnology.com/services/web-dev",
  },
};

export default function WebDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Custom Web Development Solutions",
    "description": "High-performance websites, ecommerce stores, and complex SaaS applications engineered using React, Next.js, and Node.js backend architectures.",
    "provider": {
      "@type": "Organization",
      "name": "Indux Technology",
      "url": "https://induxtechnology.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": "Web Application Development"
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
