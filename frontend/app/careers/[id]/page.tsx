import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCareerById } from "@/lib/api";
import CareerDetailClient from "./CareerDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const career = await getCareerById(id);
    if (!career || career.status !== "Active") return { title: "Job Opportunity Not Found" };

    const title = `${career.title} | Career Opportunity at Indux Technology`;
    const description = `Apply for the ${career.title} job position in our ${career.department} department at Indux Technology. Location: ${career.location || "Remote"}. ${career.description.substring(0, 150)}...`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://induxtechnology.com/careers/${id}`,
      },
      alternates: {
        canonical: `https://induxtechnology.com/careers/${id}`,
      },
    };
  } catch (error) {
    return {
      title: "Job Opportunity Not Found",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  
  let career;
  try {
    career = await getCareerById(id);
  } catch (error) {
    notFound();
  }

  if (!career || career.status !== "Active") {
    notFound();
  }

  // Structured Data: JobPosting Schema Markup (for Google Jobs integration)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: career.title,
    description: `
      <p>${career.description}</p>
      ${career.responsibilities ? `<h3>Responsibilities</h3><ul>${career.responsibilities.map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
      ${career.requirements ? `<h3>Requirements</h3><ul>${career.requirements.map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
    `,
    datePosted: career.createdAt,
    validThrough: career.lastDate || undefined,
    employmentType: career.employmentType === "Full Time" ? "FULL_TIME" : "INTERN",
    hiringOrganization: {
      "@type": "Organization",
      name: "Indux Technology",
      sameAs: "https://induxtechnology.com",
      logo: "https://induxtechnology.com/images/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: career.location || "Hybrid/Remote",
        addressCountry: "IN",
      },
    },
    baseSalary: career.salary ? {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        value: career.salary,
        unitText: "MONTH"
      }
    } : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CareerDetailClient career={career} />
    </>
  );
}