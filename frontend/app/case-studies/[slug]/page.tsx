import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug, getCaseStudies, CaseStudy } from "@/lib/api";
import CaseStudyDetailClient from "./CaseStudyDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const fallbackJemsoft: CaseStudy = {
  _id: "seed-jemsoft",
  name: "Jemsoft (insurance)",
  slug: "jemsoft-insurance",
  headline: "Helping insurance agents manage policies and renewals in one system",
  challenge:
    "Agents tracked client policies and renewal dates manually across multiple carriers, which led to missed renewals, delayed customer communications, and lost trail commissions.",
  solution:
    "An insurance ERP with client records, policy tracking, automated premium reminders via WhatsApp, and automated commission reconciliation.",
  result:
    "+25% increase in annual policy retention and 15 hours per week saved on administrative follow-ups.",
  image: "/jemsoft.webp",
  status: "Published",
  views: 124,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    let caseStudy: CaseStudy | null = null;
    try {
      caseStudy = await getCaseStudyBySlug(slug);
    } catch {
      if (slug === "jemsoft-insurance") caseStudy = fallbackJemsoft;
    }

    if (!caseStudy) {
      return { title: "Case Study Not Found" };
    }

    return {
      title: `${caseStudy.name} Case Study | Indux Technology`,
      description: caseStudy.headline,
      openGraph: {
        title: `${caseStudy.name}: ${caseStudy.headline}`,
        description: caseStudy.challenge,
        type: "article",
        images: [
          caseStudy.image
            ? caseStudy.image.startsWith("http")
              ? caseStudy.image
              : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${caseStudy.image}`
            : "/images/unsplash/img-0f36d5cf.webp",
        ],
      },
    };
  } catch {
    return { title: "Case Study | Indux Technology" };
  }
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let caseStudy: CaseStudy | null = null;
  let otherStudies: CaseStudy[] = [];

  try {
    caseStudy = await getCaseStudyBySlug(slug);
  } catch {
    if (slug === "jemsoft-insurance") {
      caseStudy = fallbackJemsoft;
    }
  }

  if (!caseStudy) {
    notFound();
  }

  try {
    const all = await getCaseStudies();
    otherStudies = all.filter((s) => s.slug !== slug).slice(0, 3);
  } catch {
    otherStudies = [];
  }

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseStudy.headline,
    description: caseStudy.challenge,
    image: caseStudy.image ? `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${caseStudy.image}` : "",
    datePublished: caseStudy.createdAt,
    dateModified: caseStudy.updatedAt,
    author: {
      "@type": "Organization",
      name: "Indux Technology",
    },
    publisher: {
      "@type": "Organization",
      name: "Indux Technology",
      logo: {
        "@type": "ImageObject",
        url: "https://induxtechnology.com/images/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyDetailClient caseStudy={caseStudy} relatedStudies={otherStudies} />
    </>
  );
}
