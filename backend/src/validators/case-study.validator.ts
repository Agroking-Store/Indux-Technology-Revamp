import { z } from "zod";

export const createCaseStudySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, alphanumeric, hyphen-separated"
    )
    .optional(),
  headline: z.string().trim().min(1, "Headline is required"),
  challenge: z.string().trim().min(1, "The challenge is required"),
  solution: z.string().trim().min(1, "What we built is required"),
  result: z.string().trim().min(1, "The result is required"),
  image: z.string().optional(),
  status: z.enum(["Draft", "Published"]).default("Published"),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();

export const updateCaseStudyStatusSchema = z.object({
  status: z.enum(["Draft", "Published"]),
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
export type UpdateCaseStudyStatusInput = z.infer<
  typeof updateCaseStudyStatusSchema
>;

