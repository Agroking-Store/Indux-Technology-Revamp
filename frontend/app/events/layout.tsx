import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Meetups",
  description: "Join our conferences, developer hackathons, community webinars, and corporate showcases. Engage with experts and build the future with Indux Technology.",
  alternates: {
    canonical: "https://induxtechnology.com/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
