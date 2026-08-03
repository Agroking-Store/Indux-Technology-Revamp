// admin/app/(protected)/blogs/_components/BlogForm.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  FileText,
  ArrowLeft,
  Image as ImageIcon,
  Settings,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  shortDescription: z.string().min(1, "Short description is required").max(300),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  status: z.enum(["Draft", "Published"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featuredImage: z.any().optional(),
});

export type BlogFormData = z.infer<typeof blogSchema>;

const RECOMMENDED_MAX_IMAGE_SIZE = 3 * 1024 * 1024;

interface BlogFormProps {
  initialValues?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  loading: boolean;
  isEditing?: boolean;
  isViewMode?: boolean;
}

export default function BlogForm({
  initialValues,
  onSubmit,
  loading,
  isEditing = false,
  isViewMode = false,
}: BlogFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>(
    initialValues?.featuredImage || "",
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "Draft",
      slug: "",
      shortDescription: "",
      content: "",
      category: "Technology",
      tags: "",
      author: "Indux Team",
      seoTitle: "",
      seoDescription: "",
      featuredImage: "",
      ...initialValues,
    },
  });

  const watchStatus = watch("status");

  useEffect(() => {
    if (initialValues) {
      reset({
        status: "Draft",
        slug: "",
        shortDescription: "",
        content: "",
        category: "Technology",
        tags: "",
        author: "Indux Team",
        seoTitle: "",
        seoDescription: "",
        featuredImage: "",
        ...initialValues,
      });
      if (initialValues.featuredImage) {
        setImagePreview(initialValues.featuredImage);
      }
    }
  }, [initialValues, reset]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isViewMode) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > RECOMMENDED_MAX_IMAGE_SIZE) {
      toast.warning(
        `That image is ${(file.size / (1024 * 1024)).toFixed(1)}MB — consider compressing it first.`,
      );
    }

    try {
      setValue("featuredImage", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
    } catch {
      toast.error("Failed to select the image.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left"
    >
      {/* ═══════════════ LEFT COLUMN ═══════════════ */}
      <div className="lg:col-span-2 space-y-6">
        {/* Article Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="text-indigo-600 dark:text-indigo-400 size-5" />
              Article Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Article Title *
              </Label>
              <Input
                {...register("title")}
                disabled={isViewMode}
                placeholder="e.g. Navigating Next.js 16 Compiler Performance"
              />
              {errors.title && (
                <p className="text-destructive text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Slug & Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Slug (optional)
                </Label>
                {isViewMode ? (
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
                    <span className="text-slate-400 text-xs font-mono shrink-0">
                      /blogs/
                    </span>
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-300">
                      {initialValues?.slug || "—"}
                    </span>
                  </div>
                ) : (
                  <Input
                    {...register("slug")}
                    placeholder="auto-generated from title"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Author *
                </Label>
                <Input {...register("author")} disabled={isViewMode} />
                {errors.author && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.author.message}
                  </p>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Short Summary *
              </Label>
              <Textarea
                {...register("shortDescription")}
                disabled={isViewMode}
                rows={2}
                maxLength={300}
                className="max-h-[200px] overflow-y-auto"
                placeholder="Quick hook summary displayed in cards (max 300 chars)"
              />
              {errors.shortDescription && (
                <p className="text-destructive text-xs mt-1">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Article Body * (HTML/Markdown supported)
              </Label>
              <Textarea
                {...register("content")}
                disabled={isViewMode}
                rows={isViewMode ? 16 : 10}
                className="font-mono max-h-[500px] overflow-y-auto"
                placeholder="Write full blog post contents here..."
              />
              {errors.content && (
                <p className="text-destructive text-xs mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="text-indigo-600 dark:text-indigo-400 size-5" />
              SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                SEO Search Title (optional)
              </Label>
              <Input
                {...register("seoTitle")}
                disabled={isViewMode}
                placeholder="SEO title tag override"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                SEO Meta Description (optional)
              </Label>
              <Input
                {...register("seoDescription")}
                disabled={isViewMode}
                placeholder="SEO meta description snippet override"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
      <div className="space-y-6">
        {/* Parameters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">
              Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Status
              </Label>
              {isViewMode ? (
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={
                      watchStatus === "Published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40 font-bold"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40 font-bold"
                    }
                  >
                    {watchStatus === "Published" ? "● Published" : "● Draft"}
                  </Badge>
                </div>
              ) : (
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "Draft"}
                      disabled={isViewMode}
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft" className="cursor-pointer">
                          Draft
                        </SelectItem>
                        <SelectItem
                          value="Published"
                          className="cursor-pointer"
                        >
                          Published
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Category *
              </Label>
              <Input
                {...register("category")}
                disabled={isViewMode}
                placeholder="e.g. Tech, Dev, AI"
              />
              {errors.category && (
                <p className="text-destructive text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Tags (comma separated)
              </Label>
              <Input
                {...register("tags")}
                disabled={isViewMode}
                placeholder="react, nextjs, routing"
              />
              {/* View mode: show tags as pills */}
              {isViewMode && initialValues?.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {initialValues.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
                      >
                        #{tag}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Featured Image Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-1.5">
              <ImageIcon
                className="text-indigo-600 dark:text-indigo-400"
                size={18}
              />
              Featured Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Image preview */}
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={
                      imagePreview.startsWith("blob:") ||
                      imagePreview.startsWith("http")
                        ? imagePreview
                        : `${process.env.NEXT_PUBLIC_API_URL}${imagePreview}`
                    }
                    alt="Featured image preview"
                    className="w-full h-40 object-cover"
                  />
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setValue("featuredImage", "");
                      }}
                      className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-2 py-1 rounded-lg cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500">
                  <ImageIcon size={24} className="mb-1.5 opacity-40" />
                  <span className="text-xs font-medium">No image selected</span>
                </div>
              )}

              {/* Upload input (hidden in view mode) */}
              {!isViewMode && (
                <>
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Upload Image *
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="cursor-pointer file:cursor-pointer file:text-indigo-600 dark:file:text-indigo-400"
                  />
                </>
              )}

              <input type="hidden" {...register("featuredImage")} />
              {errors.featuredImage && !isViewMode && (
                <p className="text-destructive text-xs mt-1">
                  {errors.featuredImage.message as string}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/blogs")}
            className="flex-1 cursor-pointer"
          >
            {isViewMode ? "Back" : "Cancel"}
          </Button>

          {!isViewMode && (
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Submitting..."
                : isEditing
                  ? "Update Post"
                  : "Write Post"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
