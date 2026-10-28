import type { Metadata } from "next";
import { projects } from "@/lib/products-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = projects.find((p) => p.slug === slug);
  if (!product) return {};

  if (slug === "indux-crm") {
    return {
      title: "Custom CRM Software Development | Indux Technology",
      description:
        "Manage leads, customer relationships, sales activities, and follow-ups with custom CRM software designed around your business workflows.",
      alternates: {
        canonical: `https://induxtechnology.com/products/${slug}`,
      },
      openGraph: {
        title: "Custom CRM Software Development | Indux Technology",
        description:
          "Manage leads, customer relationships, sales activities, and follow-ups with custom CRM software designed around your business workflows.",
        url: `https://induxtechnology.com/products/${slug}`,
      },
      twitter: {
        title: "Custom CRM Software Development | Indux Technology",
        description:
          "Manage leads, customer relationships, sales activities, and follow-ups with custom CRM software designed around your business workflows.",
      },
    };
  }

  return {
    title: `${product.title} | Indux Technology`,
    description: product.shortDescription,
    alternates: {
      canonical: `https://induxtechnology.com/products/${slug}`,
    },
    openGraph: {
      title: `${product.title} | Indux Technology`,
      description: product.shortDescription,
      url: `https://induxtechnology.com/products/${slug}`,
    },
    twitter: {
      title: `${product.title} | Indux Technology`,
      description: product.shortDescription,
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
