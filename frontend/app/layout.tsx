import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingSocials from "@/components/FloatingSocials";
import Script from "next/script";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://induxtechnology.com"),
  title: {
    default: "Indux Technology | Custom IT Solutions, CRM & ERP Development",
    template: "%s | Indux Technology"
  },
  description: "Indux Technology provides top-rated custom IT solutions, including custom CRM systems, manufacturing ERP software, sales automation, cloud migration, cybersecurity, and digital transformation.",
  keywords: [
    "Indux Technology", 
    "custom CRM systems", 
    "manufacturing ERP software", 
    "sales automation", 
    "IT consultancy", 
    "software development company", 
    "cloud migration", 
    "cybersecurity solutions", 
    "enterprise software solutions"
  ],
  authors: [{ name: "Indux Technology" }],
  creator: "Indux Technology",
  publisher: "Indux Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://induxtechnology.com",
    title: "Indux Technology | Custom IT Solutions, CRM & ERP Development",
    description: "Transform your business with custom CRM, ERP, and Sales Automation solutions built by Indux Technology.",
    siteName: "Indux Technology",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Indux Technology - Custom IT Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indux Technology | Custom IT Solutions, CRM & ERP Development",
    description: "Transform your business with custom CRM, ERP, and Sales Automation solutions built by Indux Technology.",
    images: ["/images/og-image.jpg"],
    creator: "@InduxTech",
  },
  alternates: {
    canonical: "https://induxtechnology.com",
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
        <ScrollToTop />
        <FloatingSocials />

        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,mr,ar,es,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
      </body>
    </html>
  );
}
