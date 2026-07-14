import { z } from "zod";

const safeJsonParse = (val: any) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return {};
    }
  }
  return val || {};
};

export const createRegistrationSchema = z.object({
  eventId: z.string().trim().min(1, "Event ID is required"),
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email format"),
  phone: z.string().trim().min(5, "Invalid phone number format"),
  answers: z
    .union([z.string(), z.record(z.string(), z.any())])
    .optional()
    .transform(safeJsonParse)
    .default({}),
});

export const updateRegistrationStatusSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected", "Attended"]),
});

export const updateRegistrationNotesSchema = z.object({
  notes: z.string().trim().optional(),
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
export type UpdateRegistrationStatusInput = z.infer<typeof updateRegistrationStatusSchema>;
export type UpdateRegistrationNotesInput = z.infer<typeof updateRegistrationNotesSchema>;
