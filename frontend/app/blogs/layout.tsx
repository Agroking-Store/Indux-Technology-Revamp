import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & IT Insights",
  description: "Stay up-to-date with the latest tech articles, insights on cloud migration, cybersecurity, CRM best practices, and AI innovations from Indux Technology.",
  alternates: {
    canonical: "https://induxtechnology.com/blogs",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
