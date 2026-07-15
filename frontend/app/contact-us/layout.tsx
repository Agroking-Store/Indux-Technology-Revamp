import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Quote",
  description: "Get in touch with the IT experts at Indux Technology. Request a free quote for custom software, CRM, ERP, or digital transformation consultations.",
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
