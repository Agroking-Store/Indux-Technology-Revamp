"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import api, { ApiResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CaseStudyForm, { CaseStudyFormData } from "../../_components/CaseStudyForm";

export default function EditCaseStudyPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [initialValues, setInitialValues] =
    useState<Partial<CaseStudyFormData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/case-studies/${id}`);
        const data = res.data.data;

        const imageUrl = data.image
          ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${data.image}`
          : "";

        setInitialValues({
          name: data.name || "",
          slug: data.slug || "",
          headline: data.headline || "",
          challenge: data.challenge || "",
          solution: data.solution || "",
          result: data.result || "",
          status: data.status || "Published",
          image: imageUrl,
        });
      } catch {
        toast.error("Failed to load case study details.");
        router.push("/case-studies");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchCaseStudy();
  }, [id, router]);

  const onSubmit = async (data: CaseStudyFormData, removeImageFlag?: boolean) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      if (data.slug) formData.append("slug", data.slug);
      formData.append("headline", data.headline);
      formData.append("challenge", data.challenge);
      formData.append("solution", data.solution);
      formData.append("result", data.result);
      formData.append("status", data.status);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (removeImageFlag) {
        formData.append("removeImage", "true");
      }

      await api.put(`/case-studies/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Case study updated successfully!");
      router.push("/case-studies");
    } catch {
      // Handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/case-studies")}
          className="text-muted-foreground"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Edit Case Study
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update project details, challenge statement, solution, or verified results.
          </p>
        </div>
      </div>

      {fetching ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <CaseStudyForm
          initialValues={initialValues || undefined}
          onSubmit={onSubmit}
          loading={loading}
          isEditing
        />
      )}
    </div>
  );
}

