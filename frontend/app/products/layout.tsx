import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Software Products | Indux CRM, HRMS, ERP",
  description:
    "Explore Indux CRM, HRMS, Jemsoft insurance ERP and InduxERP, ready-to-use business software from Indux Technology in Pune.",
  keywords: [
    "Indux CRM",
    "HRMS",
    "Jemsoft insurance ERP",
    "InduxERP",
    "CRM Software",
    "ERP Software",
    "Billing Software",
    "Ai Solution",
    "Enterprise Software",
    "Mobile App Development",
    "Business Software Pune",
  ],
  alternates: {
    canonical: "https://induxtechnology.com/products",
  },
  openGraph: {
    title: "Business Software Products | Indux CRM, HRMS, ERP",
    description:
      "Explore Indux CRM, HRMS, Jemsoft insurance ERP and InduxERP, ready-to-use business software from Indux Technology in Pune.",
    url: "https://induxtechnology.com/products",
    siteName: "Indux Technology",
    locale: "en_US",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
