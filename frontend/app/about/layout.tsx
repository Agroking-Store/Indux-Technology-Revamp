import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Indux Technology | Software Company in Pune",
  description: "Meet the Pune team behind Indux CRM, Jemsoft and InduxERP. Learn how Indux Technology builds practical software for growing businesses.",
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
