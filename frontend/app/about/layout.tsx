import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Indux Technology – Software Company Pune",
  description: " Discover Indux Technology, a Pune-based software company offering custom CRM, ERP, AI, automation, and web and mobile app development.",
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
