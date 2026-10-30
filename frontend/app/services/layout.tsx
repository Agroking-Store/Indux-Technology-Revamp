import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM, ERP and Custom Software Development in Pune | Indux",
  description:
    "Custom CRM, manufacturing ERP, sales automation, AI automation, and web and mobile app development from Indux Technology, Pune.",
  alternates: {
    canonical: "https://induxtechnology.com/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
