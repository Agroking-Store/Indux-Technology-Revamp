import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Opportunity | Indux Technology",
  description: "Explore the Full Stack Developer Career Opportunity at Indux Technology. Apply for our 3-month remote internship today.",
  alternates: {
    canonical: "https://induxtechnology.com/careers",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
