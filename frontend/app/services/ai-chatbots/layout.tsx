import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Software Development & Intelligent Chatbots | Indux Technology",
  description: "Integrate AI solutions into your business workflow. Indux Technology in Pune builds custom AI agents, LLM integrations, intelligent chatbots, and predictive analytics tools.",
  alternates: {
    canonical: "https://induxtechnology.com/services/ai-chatbots",
  },
};

export default function AIChatbotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Artificial Intelligence & Chatbot Solutions",
    "description": "Custom LLM integrations, intelligent conversational AI chatbots, generative agents, and predictive machine learning models to automate service tasks.",
    "provider": {
      "@type": "Organization",
      "name": "Indux Technology",
      "url": "https://induxtechnology.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": "AI Software Solutions"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
