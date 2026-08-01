import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().optional(),
  careerId: z.string().optional(), // compatibility
  candidateName: z.string().optional(),
  fullName: z.string().optional(), // compatibility
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Please enter a valid phone number format (numbers only)"),
  experience: z.string().min(1, "Experience details are required"),
  coverLetter: z.string().optional(),
  portfolio: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  noticePeriod: z.string().optional(),
  expectedCTC: z.string().optional(),
  skills: z.string().optional(),
  preferredLocation: z.string().optional(),
  answers: z.any().optional(), // parsed custom fields responses
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "New",
    "Reviewed",
    "Shortlisted",
    "Interview Scheduled",
    "Interview Completed",
    "Offered",
    "Hired",
    "Rejected",
  ]),
});