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
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export const caseStudySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  headline: z.string().min(1, "Headline is required"),
  challenge: z.string().min(1, "The challenge is required"),
  solution: z.string().min(1, "What we built is required"),
  result: z.string().min(1, "The result is required"),
  status: z.enum(["Draft", "Published"]),
  image: z.any().optional(),
});

export type CaseStudyFormData = z.infer<typeof caseStudySchema>;

const RECOMMENDED_MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface CaseStudyFormProps {
  initialValues?: Partial<CaseStudyFormData>;
  onSubmit: (data: CaseStudyFormData, removeImageFlag?: boolean) => Promise<void>;
  loading: boolean;
  isEditing?: boolean;
  isViewMode?: boolean;
}

export default function CaseStudyForm({
  initialValues,
  onSubmit,
  loading,
  isEditing = false,
  isViewMode = false,
}: CaseStudyFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>(
    typeof initialValues?.image === "string" ? initialValues.image : ""
  );
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      name: "",
      slug: "",
      headline: "",
      challenge: "",
      solution: "",
      result: "",
      status: "Published",
      image: "",
      ...initialValues,
    },
  });

  const watchStatus = watch("status");

  useEffect(() => {
    if (initialValues) {
      reset({
        name: "",
        slug: "",
        headline: "",
        challenge: "",
        solution: "",
        result: "",
        status: "Published",
        image: "",
        ...initialValues,
      });
      if (initialValues.image && typeof initialValues.image === "string") {
        setImagePreview(initialValues.image);
      } else {
        setImagePreview("");
      }
    }
  }, [initialValues, reset]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isViewMode) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > RECOMMENDED_MAX_IMAGE_SIZE) {
      toast.warning(
        `Image size is ${(file.size / (1024 * 1024)).toFixed(1)}MB — consider optimizing it.`
      );
    }

    setValue("image", file, { shouldValidate: true });
    setRemoveExistingImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (isViewMode) return;
    setValue("image", null, { shouldValidate: true });
    setImagePreview("");
    setRemoveExistingImage(true);
  };

  const handleFormSubmit = async (data: CaseStudyFormData) => {
    await onSubmit(data, removeExistingImage);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left"
    >
      {/* ═══════════════ LEFT COLUMN (Main Content) ═══════════════ */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="text-indigo-600 dark:text-indigo-400 size-5" />
              Case Study Information
            </CardTitle>
            <CardDescription>
              Detail the client name, headline, challenge faced, custom solution built, and verified results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-semibold">
                Client / Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Jemsoft (insurance)"
                disabled={isViewMode}
                className="mt-1.5"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Headline */}
            <div>
              <Label htmlFor="headline" className="text-sm font-semibold">
                Headline <span className="text-red-500">*</span>
              </Label>
              <Input
                id="headline"
                placeholder="e.g., Helping insurance agents manage policies and renewals in one system"
                disabled={isViewMode}
                className="mt-1.5"
                {...register("headline")}
              />
              {errors.headline && (
                <p className="text-xs text-red-500 mt-1">{errors.headline.message}</p>
              )}
            </div>

            {/* The Challenge */}
            <div>
              <Label htmlFor="challenge" className="text-sm font-semibold">
                The Challenge <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="challenge"
                rows={4}
                placeholder="Describe the initial bottleneck or struggle (e.g., Agents tracked client policies and renewal dates manually, which led to missed renewals and lost revenue)."
                disabled={isViewMode}
                className="mt-1.5 resize-y"
                {...register("challenge")}
              />
              {errors.challenge && (
                <p className="text-xs text-red-500 mt-1">{errors.challenge.message}</p>
              )}
            </div>

            {/* What We Built */}
            <div>
              <Label htmlFor="solution" className="text-sm font-semibold">
                What We Built <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="solution"
                rows={4}
                placeholder="Explain the technical and product solution (e.g., An insurance ERP with client records, policy tracking, premium reminders and reporting)."
                disabled={isViewMode}
                className="mt-1.5 resize-y"
                {...register("solution")}
              />
              {errors.solution && (
                <p className="text-xs text-red-500 mt-1">{errors.solution.message}</p>
              )}
            </div>

            {/* The Result */}
            <div>
              <Label htmlFor="result" className="text-sm font-semibold">
                The Result <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="result"
                rows={3}
                placeholder="Detail the measurable impact or verified outcome (e.g., 25% increase in policy retention, 15 hours saved per week on administrative tasks)."
                disabled={isViewMode}
                className="mt-1.5 resize-y"
                {...register("result")}
              />
              {errors.result && (
                <p className="text-xs text-red-500 mt-1">{errors.result.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════ RIGHT COLUMN (Sidebar Settings & Image) ═══════════════ */}
      <div className="space-y-6">
        {/* Publish & Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="text-indigo-600 dark:text-indigo-400 size-5" />
                Publish Settings
              </span>
              <Badge
                variant={watchStatus === "Published" ? "default" : "secondary"}
                className={
                  watchStatus === "Published"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }
              >
                {watchStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status" className="text-sm font-semibold">
                Status
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="slug" className="text-sm font-semibold">
                Custom URL Slug <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="slug"
                placeholder="e.g. jemsoft-insurance"
                disabled={isViewMode}
                className="mt-1.5"
                {...register("slug")}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Auto-generated from Name if left blank.
              </p>
            </div>

            {!isViewMode && (
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Case Study"
                    : "Publish Case Study"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optional Image Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="text-indigo-600 dark:text-indigo-400 size-5" />
              Featured Image
            </CardTitle>
            <CardDescription>
              Optional. You can add a showcase screenshot or leave it blank to skip.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagePreview ? (
              <div className="relative group rounded-xl overflow-hidden border border-border bg-slate-50 dark:bg-slate-900 aspect-video flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Case Study Preview"
                  className="w-full h-full object-cover"
                />
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition shadow"
                    title="Remove Image"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/50">
                <UploadCloud className="size-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground mb-2">
                  No image selected (Optional)
                </p>
              </div>
            )}

            {!isViewMode && (
              <div>
                <Label
                  htmlFor="case-study-image"
                  className="inline-flex items-center justify-center w-full px-4 py-2 border border-border rounded-md text-sm font-medium bg-background hover:bg-accent cursor-pointer transition"
                >
                  <UploadCloud className="size-4 mr-2" />
                  {imagePreview ? "Replace Image" : "Upload Image (Optional)"}
                </Label>
                <input
                  id="case-study-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  PNG, JPG, or WEBP up to 5MB. User can add or skip.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

