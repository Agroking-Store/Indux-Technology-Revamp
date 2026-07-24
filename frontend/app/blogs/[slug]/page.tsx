import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/api";
import BlogDetailClient from "./BlogDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Next.js 15 dynamic metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) return { title: "Article Not Found" };

    const title = blog.seoTitle || blog.title;
    const description = blog.seoDescription || blog.shortDescription;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: [blog.author],
        images: [
          {
            url: blog.featuredImage,
            alt: blog.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [blog.featuredImage],
      },
      alternates: {
        canonical: `https://induxtechnology.com/blogs/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Article Not Found",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  let blog;
  let relatedBlogs: any[] = [];
  try {
    blog = await getBlogBySlug(slug);
    const allBlogs = await getBlogs();
    relatedBlogs = allBlogs
      .filter((b: any) => b.slug !== slug)
      .slice(0, 3);
  } catch (error) {
    notFound();
  }

  if (!blog) {
    notFound();
  }

  // Structured Data: BlogPosting Schema Markup for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: blog.featuredImage,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Indux Technology",
      logo: {
        "@type": "ImageObject",
        url: "https://induxtechnology.com/images/logo.png",
      },
    },
    description: blog.shortDescription,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient blog={blog} relatedBlogs={relatedBlogs} />
    </>
  );
}