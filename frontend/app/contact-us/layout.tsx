import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Indux Technology | Get a Free Quote",
  description: "Contact Indux Technology for custom software development, CRM, ERP, AI, and automation solutions. Get in touch with our team to discuss your project",
  alternates: {
    canonical: "https://induxtechnology.com/contact-us",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
