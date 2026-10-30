import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Recent Works & Portfolio | Indux Technology",
  description:
    "Explore our recent work, client case studies, web applications, and digital solutions delivered across various industries.",
  keywords: [
    "Portfolio",
    "Recent Works",
    "Case Studies",
    "Web Development Projects",
    "Client Showcase",
    "Software Solutions",
  ],
  alternates: {
    canonical: "https://induxtechnology.com/our-recent-works",
  },
};

export default function OurRecentWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
