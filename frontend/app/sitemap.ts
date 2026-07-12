import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://induxtechnology.com';

  // 1. Define Static Routes
  const staticRoutes = ['', '/blogs', '/careers'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch Active Blogs dynamically
  try {
    const blogs = await getBlogs();
    const dynamicBlogRoutes = blogs
      .filter((blog) => blog.status === 'Published')
      .map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

    return [...staticRoutes, ...dynamicBlogRoutes];
  } catch (error) {
    console.error('Failed to generate sitemap for dynamic blogs:', error);
    return staticRoutes;
  }
}
