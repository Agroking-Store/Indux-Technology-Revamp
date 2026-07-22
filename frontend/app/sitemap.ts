import { MetadataRoute } from "next";
import { getBlogs, getCareers, getEvents } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://induxtechnology.com";

  // 1. Static Pages
  const staticPaths = [
    "",
    "/about",
    "/services",
    "/products",
    "/industries",
    "/contact-us",
    "/careers",
    "/blogs",
    "/events",
    "/privacy-policy",
    "/terms-of-service",
  ];

  const staticRoutes = staticPaths.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/contact-us" ? 0.9 : 0.8,
  }));

  // 2. Dynamic Blog Routes
  let dynamicBlogRoutes: any[] = [];
  try {
    const blogs = await getBlogs();
    dynamicBlogRoutes = blogs
      .filter((blog) => blog.status === "Published")
      .map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
  } catch (error) {
    console.error("Failed to generate sitemap for dynamic blogs:", error);
  }

  // 3. Dynamic Career Routes
  let dynamicCareerRoutes: any[] = [];
  try {
    const careers = await getCareers();
    dynamicCareerRoutes = careers
      .filter((career) => career.status === "Active")
      .map((career) => ({
        url: `${baseUrl}/careers/${career._id}`,
        lastModified: new Date(career.updatedAt || career.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
  } catch (error) {
    console.error("Failed to generate sitemap for dynamic careers:", error);
  }

  // 4. Dynamic Event Routes
  let dynamicEventRoutes: any[] = [];
  try {
    const events = await getEvents();
    dynamicEventRoutes = events
      .filter((event) => event.status === "Published")
      .map((event) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: new Date(event.updatedAt || event.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
  } catch (error) {
    console.error("Failed to generate sitemap for dynamic events:", error);
  }

  return [
    ...staticRoutes,
    ...dynamicBlogRoutes,
    ...dynamicCareerRoutes,
    ...dynamicEventRoutes,
  ];
}
