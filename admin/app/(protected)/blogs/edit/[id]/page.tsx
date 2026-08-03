"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import api, { ApiResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BlogForm, { BlogFormData } from "../../_components/BlogForm";

export default function EditBlogPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [initialValues, setInitialValues] =
    useState<Partial<BlogFormData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/blogs/${id}`);
        const blog = res.data.data;

        const tagsString = blog.tags?.join(", ") || "";

        setInitialValues({
          title: blog.title,
          slug: blog.slug || "",
          shortDescription: blog.shortDescription || "",
          content: blog.content || "",
          category: blog.category || "Technology",
          tags: tagsString,
          author: blog.author || "Indux Team",
          status: blog.status || "Draft",
          seoTitle: blog.seoTitle || "",
          seoDescription: blog.seoDescription || "",
          featuredImage:  `${process.env.NEXT_PUBLIC_API_URL}${blog.blog.featuredImage}`,
        });
      } catch (error) {
        toast.error("Failed to load article details.");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "tags") {
          formData.append(key, JSON.stringify(tagsArray));
        } else if (value !== undefined && value !== null) {
          // In edit mode, if the image wasn't changed, it might still be the URL string.
          // FormData handles both strings and Files.
          formData.append(key, value as string | Blob);
        }
      });

      await api.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Article updated successfully");
      router.push("/blogs");
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 transition-colors duration-300">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/blogs")}
          className="text-muted-foreground cursor-pointer"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Edit Article
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Compose article content, categories, and SEO configurations.
          </p>
        </div>
      </div>

      <BlogForm
        initialValues={initialValues || undefined}
        onSubmit={onSubmit}
        loading={loading}
        isEditing={true}
      />
    </div>
  );
}
