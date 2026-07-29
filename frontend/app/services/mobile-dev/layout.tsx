import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile App Development Services (iOS & Android) | Indux Technology",
  description: "Build native and cross-platform mobile apps with Indux Technology in Pune. We develop high-performance, user-friendly iOS and Android applications tailored to your business.",
  alternates: {
    canonical: "https://induxtechnology.com/services/mobile-dev",
  },
};

export default function MobileDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Mobile Application Development Solutions",
    "description": "Premium native iOS & Android applications and cross-platform Flutter/React Native solutions built for scale and premium performance.",
    "provider": {
      "@type": "Organization",
      "name": "Indux Technology",
      "url": "https://induxtechnology.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": "Mobile App Development"
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
