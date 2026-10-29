import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products & Software Solutions",
  description: "Discover off-the-shelf and customizable enterprise software products developed by Indux Technology to streamline operations, sales, and logistics.",
  alternates: {
    canonical: "https://induxtechnology.com/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
