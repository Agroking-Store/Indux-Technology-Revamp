import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Development & Automation Solutions | Indux Technology",
  description: "Explore AI development and automation solutions that help businesses improve workflows, automate repetitive tasks, and support smarter decision-making.",
  alternates: {
    canonical: "https://induxtechnology.com/services/ai-chatbots",
  },
  openGraph: {
    title: "AI Development & Automation Solutions | Indux Technology",
    description: "Explore AI development and automation solutions that help businesses improve workflows, automate repetitive tasks, and support smarter decision-making.",
    url: "https://induxtechnology.com/services/ai-chatbots",
  },
  twitter: {
    title: "AI Development & Automation Solutions | Indux Technology",
    description: "Explore AI development and automation solutions that help businesses improve workflows, automate repetitive tasks, and support smarter decision-making.",
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
