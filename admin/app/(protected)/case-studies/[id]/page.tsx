"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft, Pencil } from "lucide-react";
import api, { ApiResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CaseStudyForm, { CaseStudyFormData } from "../_components/CaseStudyForm";

export default function ViewCaseStudyPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [initialValues, setInitialValues] =
    useState<Partial<CaseStudyFormData> | null>(null);
  const [fetching, setFetching] = useState(true);
  const [caseStudyName, setCaseStudyName] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchCaseStudy = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/case-studies/${id}`);
        const data = res.data.data;

        setCaseStudyName(data.name || "Case Study Details");
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

    fetchCaseStudy();
  }, [id, router]);

  const onSubmit = async () => {};

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push("/case-studies")}
            className="text-muted-foreground cursor-pointer"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              {fetching ? "Loading..." : caseStudyName}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Read-only view of case study records.
            </p>
          </div>
        </div>

        {!fetching && (
          <Button
            onClick={() => router.push(`/case-studies/edit/${id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-medium cursor-pointer"
          >
            <Pencil size={16} />
            Edit Case Study
          </Button>
        )}
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
          loading={false}
          isViewMode
        />
      )}
    </div>
  );
}

