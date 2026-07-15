import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our IT Services",
  description: "Explore the custom IT services provided by Indux Technology. From custom CRM development and manufacturing ERP systems to sales automation, cloud migration, and cybersecurity.",
  alternates: {
    canonical: "https://induxtechnology.com/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
