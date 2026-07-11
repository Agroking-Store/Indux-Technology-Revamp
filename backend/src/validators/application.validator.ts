import { z } from "zod";

export const createApplicationSchema = z.object({
  careerId: z.string().min(1, "Career ID is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  experience: z.string().min(1, "Experience details are required"),
  coverLetter: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["Pending", "Reviewed", "Accepted", "Rejected"]),
});