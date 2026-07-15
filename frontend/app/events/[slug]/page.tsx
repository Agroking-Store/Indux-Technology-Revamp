import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/api";
import EventDetailClient from "./EventDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await getEventBySlug(slug);
    if (!event || event.status !== "Published") return { title: "Event Not Found" };

    const title = `${event.title} | Events & Meetups by Indux Technology`;
    const description = `Join us for ${event.title}. ${event.shortDescription || "Learn, collaborate and build the future with IT experts at Indux Technology."}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://induxtechnology.com/events/${slug}`,
        images: [
          {
            url: event.bannerImage || event.coverImage || "/images/default-event.jpg",
            alt: event.title,
          },
        ],
      },
      alternates: {
        canonical: `https://induxtechnology.com/events/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Event Not Found",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  let event;
  try {
    event = await getEventBySlug(slug);
  } catch (error) {
    notFound();
  }

  if (!event || event.status !== "Published") {
    notFound();
  }

  // Structured Data: Event Schema Markup (for dynamic search engine layouts)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.shortDescription || event.description,
    image: [event.coverImage, event.bannerImage].filter(Boolean),
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: event.location.toLowerCase().includes("online") || event.location.toLowerCase().includes("virtual") || event.location.toLowerCase().includes("webinar")
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.location.toLowerCase().includes("online") || event.location.toLowerCase().includes("virtual") || event.location.toLowerCase().includes("webinar")
      ? {
          "@type": "VirtualLocation",
          url: "https://induxtechnology.com/events/" + slug
        }
      : {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            streetAddress: event.location,
            addressLocality: "India",
            addressCountry: "IN",
          },
        },
    organizer: {
      "@type": "Organization",
      name: event.organizer || "Indux Technology",
      url: "https://induxtechnology.com",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: event.createdAt,
      url: "https://induxtechnology.com/events/" + slug,
    },
    performer: event.speakers?.map(s => ({
      "@type": "Person",
      name: s.name,
      jobTitle: s.role,
      worksFor: {
        "@type": "Organization",
        name: s.company || "Indux Technology",
      }
    })) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClient event={event} />
    </>
  );
}
