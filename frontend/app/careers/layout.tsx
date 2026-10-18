import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Join Our Team",
  description: "Join the engineering team at Indux Technology. Explore open job positions for backend developers, frontend developers, and tech leads, and apply online today.",
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
