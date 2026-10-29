import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Indux Technology | Get a Free Quote",
  description:
    "Talk to Indux Technology about your CRM, ERP or app project. Call, WhatsApp or email, and get a response within one business day.",
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
