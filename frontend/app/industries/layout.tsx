import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "Indux Technology serves diverse industries including manufacturing, retail, logistics, and healthcare with customized CRM, ERP, and automation solutions.",
  alternates: {
    canonical: "https://induxtechnology.com/industries",
  },
};

export default function IndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
