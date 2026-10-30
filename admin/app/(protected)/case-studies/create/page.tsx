"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import CaseStudyForm, { CaseStudyFormData } from "../_components/CaseStudyForm";

export default function CreateCaseStudyPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: CaseStudyFormData) => {
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

      // Handle optional image file
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await api.post("/case-studies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Case study created successfully!");
      router.push("/case-studies");
    } catch {
      // Error handled by api interceptor
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
          className="text-muted-foreground cursor-pointer"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Create Case Study
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Showcase client challenges, solutions built, and verified results.
          </p>
        </div>
      </div>

      <CaseStudyForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
}

