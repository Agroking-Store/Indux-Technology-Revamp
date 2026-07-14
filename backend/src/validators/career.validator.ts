import { z } from "zod";

export const createCareerSchema = z.object({
  title: z.string().trim().min(1, "Job title is required"),
  slug: z.string().trim().optional(),
  department: z.string().trim().min(1, "Department is required"),
  location: z.string().trim().min(1, "Location is required"),
  employmentType: z.enum(["Full Time", "Internship"]),
  experience: z.string().trim().min(1, "Experience is required"),
  openings: z.coerce.number().int().min(1, "Openings must be at least 1"),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.array(z.string().trim()).default([]),
  requirements: z.array(z.string().trim()).default([]),
  benefits: z.array(z.string().trim()).default([]),
  skills: z.array(z.string().trim()).default([]),
  salary: z.string().trim().optional(),
  status: z.enum(["Active", "Closed"]).default("Active"),
  formFields: z.array(z.any()).default([]),
  lastDate: z.coerce.date({ message: "Please provide a valid date" }),
});

// All fields optional for updates (partial update / PATCH-style PUT)
export const updateCareerSchema = createCareerSchema.partial();

// Dedicated schema for the "activate / close" action
export const updateCareerStatusSchema = z.object({
  status: z.enum(["Active", "Closed"]),
});

export type CreateCareerInput = z.infer<typeof createCareerSchema>;
export type UpdateCareerInput = z.infer<typeof updateCareerSchema>;
export type UpdateCareerStatusInput = z.infer<typeof updateCareerStatusSchema>;