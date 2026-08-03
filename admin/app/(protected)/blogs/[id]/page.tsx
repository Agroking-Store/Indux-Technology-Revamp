// admin/app/(protected)/blogs/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft, Pencil } from "lucide-react";
import api, { ApiResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BlogForm, { BlogFormData } from "../_components/BlogForm";

export default function ViewBlogPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [initialValues, setInitialValues] =
    useState<Partial<BlogFormData> | null>(null);
  const [fetching, setFetching] = useState(true);
  const [blogTitle, setBlogTitle] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/blogs/${id}`);
        const blog = res.data.data;

        const tagsString = Array.isArray(blog.tags) ? blog.tags.join(", ") : "";
        setBlogTitle(blog.title || "Article Details");

        setInitialValues({
          title: blog.title || "",
          slug: blog.slug || "",
          shortDescription: blog.shortDescription || "",
          content: blog.content || "",
          category: blog.category || "Technology",
          tags: tagsString,
          author: blog.author || "Indux Team",
          status: blog.status || "Draft",
          seoTitle: blog.seoTitle || "",
          seoDescription: blog.seoDescription || "",
          // featuredImage is already a full URL from the backend
          featuredImage: blog.featuredImage
            ? blog.featuredImage.startsWith("http")
              ? blog.featuredImage
              : `http://localhost:5000${blog.featuredImage}`
            : "",
        });
      } catch {
        toast.error("Failed to load article details.");
        router.push("/blogs");
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  // View mode: onSubmit is a no-op (form is disabled anyway)
  const onSubmit = async () => {};

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        {/* Form skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[160px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[220px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 transition-colors duration-300">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push("/blogs")}
            className="text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              View Article
            </h1>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
              {blogTitle}
            </p>
          </div>
        </div>

        {/* Edit button — matches events pattern */}
        <Button
          type="button"
          onClick={() => router.push(`/blogs/edit/${id}`)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-sm cursor-pointer"
        >
          <Pencil size={16} />
          Edit Article
        </Button>
      </div>

      {/* ── Blog Form in View Mode ── */}
      <BlogForm
        initialValues={initialValues || undefined}
        onSubmit={onSubmit}
        loading={false}
        isEditing={false}
        isViewMode={true}
      />
    </div>
  );
}
