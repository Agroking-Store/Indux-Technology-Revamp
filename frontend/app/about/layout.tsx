import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Indux Technology. With over 7 years of experience and 200+ completed projects, we build custom IT solutions, CRM, and ERP systems that power business success.",
  alternates: {
    canonical: "https://induxtechnology.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
