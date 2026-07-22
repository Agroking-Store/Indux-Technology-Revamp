import { z } from "zod";

// Matches Blog model. `featuredImage` is a base64 data URI (or URL) stored
// directly as a string — no separate multer/Cloudinary upload step.
export const createBlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated")
    .optional(), // auto-generated from title in the controller if omitted
  featuredImage: z.string().trim().min(1, "Featured image is required"),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .max(300, "Short description cannot exceed 300 characters"),
  content: z.string().min(1, "Content is required"),
  category: z.string().trim().min(1, "Category is required"),
  tags: z.array(z.string().trim()).default([]),
  author: z.string().trim().min(1, "Author is required"),
  status: z.enum(["Draft", "Published"]).default("Draft"),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

// All fields optional for updates (partial update / PATCH-style PUT)
export const updateBlogSchema = createBlogSchema.partial();

// Dedicated schema for the "toggle publish state" action
export const updateBlogStatusSchema = z.object({
  status: z.enum(["Draft", "Published"]),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type UpdateBlogStatusInput = z.infer<typeof updateBlogStatusSchema>;