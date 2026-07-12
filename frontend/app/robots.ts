import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://induxtechnology.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Block admin page and REST APIs from search results
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
