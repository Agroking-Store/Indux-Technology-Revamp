import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products & Software Solutions",
  description: "Discover off-the-shelf and customizable enterprise software products developed by Indux Technology to streamline operations, sales, and logistics.",
   keywords: [
    "CRM Software",
    "ERP Software",
    "HRMS",
    "Billing Software",
    "Ai Solution",
    "Enterprise Software",
    "Mobile App Develoment",
    
  ],
  alternates: {
    canonical: "https://induxtechnology.com/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
