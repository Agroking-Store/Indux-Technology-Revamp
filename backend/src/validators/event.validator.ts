import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated")
    .optional(), // auto-generated from title in the controller if omitted
  description: z.string().trim().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  date: z.coerce.date(),
  location: z.string().trim().min(1, "Location is required"),
  status: z.enum(["Draft", "Published"]).default("Draft"),
});

// All fields optional for updates
export const updateEventSchema = createEventSchema.partial();

// Toggle status schema
export const updateEventStatusSchema = z.object({
  status: z.enum(["Draft", "Published"]),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type UpdateEventStatusInput = z.infer<typeof updateEventStatusSchema>;
