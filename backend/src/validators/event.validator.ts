import { z } from "zod";

const formFieldSchema = z.object({
  name: z.string().trim().min(1, "Field name identifier is required"),
  label: z.string().trim().min(1, "Label is required"),
  type: z.enum([
    "text",
    "email",
    "phone",
    "number",
    "textarea",
    "select",
    "radio",
    "checkbox",
    "date",
    "url",
    "file",
  ]),
  required: z.boolean().default(false),
  placeholder: z.string().trim().optional(),
  defaultValue: z.string().trim().optional(),
  options: z.array(z.string().trim()).optional(),
  validation: z
    .object({
      pattern: z.string().optional(),
      min: z.coerce.number().optional(),
      max: z.coerce.number().optional(),
    })
    .optional(),
});

const speakerSchema = z.object({
  name: z.string().trim().min(1, "Speaker name is required"),
  role: z.string().trim().min(1, "Speaker role is required"),
  company: z.string().trim().optional(),
  avatar: z.string().trim().optional(),
});

const scheduleItemSchema = z.object({
  time: z.string().trim().min(1, "Time slot is required"),
  title: z.string().trim().min(1, "Activity title is required"),
  description: z.string().trim().optional(),
});

const faqItemSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
});

const safeJsonParse = (val: any) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return val || [];
};

export const createEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated")
    .optional(),
  type: z.string().trim().min(1, "Event type is required"),
  category: z.string().trim().min(1, "Category is required"),
  shortDescription: z.string().trim().min(1, "Short description is required"),
  description: z.string().trim().min(1, "Full description is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  registrationDeadline: z.coerce.date(),
  organizer: z.string().trim().min(1, "Organizer is required"),
  location: z.string().trim().min(1, "Location / venue is required"),
  status: z.enum(["Draft", "Published"]).default("Draft"),
  formFields: z
    .union([z.string(), z.array(z.any())])
    .optional()
    .transform(safeJsonParse)
    .pipe(z.array(formFieldSchema))
    .default([]),
  speakers: z
    .union([z.string(), z.array(z.any())])
    .optional()
    .transform(safeJsonParse)
    .pipe(z.array(speakerSchema))
    .optional(),
  schedule: z
    .union([z.string(), z.array(z.any())])
    .optional()
    .transform(safeJsonParse)
    .pipe(z.array(scheduleItemSchema))
    .optional(),
  faqs: z
    .union([z.string(), z.array(z.any())])
    .optional()
    .transform(safeJsonParse)
    .pipe(z.array(faqItemSchema))
    .optional(),
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
export type FormFieldType = z.infer<typeof formFieldSchema>;
export type SpeakerType = z.infer<typeof speakerSchema>;
export type ScheduleItemType = z.infer<typeof scheduleItemSchema>;
export type FaqItemType = z.infer<typeof faqItemSchema>;
