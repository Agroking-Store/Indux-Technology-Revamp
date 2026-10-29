import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies & Client Results | Indux Technology",
  description:
    "Explore how Indux Technology helps businesses solve operational challenges with custom CRM, ERP, and AI software. Real challenges, custom systems, verified results.",
  alternates: {
    canonical: "https://induxtechnology.com/case-studies",
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

