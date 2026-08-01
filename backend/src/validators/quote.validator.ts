import { z } from "zod";

export const createQuoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().optional(),
  workEmail: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Please enter a valid phone number format (numbers only)"),
  serviceInterest: z.string().min(1, "Please select a service"),
  message: z.string().optional(),
});

export const updateQuoteStatusSchema = z.object({
  status: z.enum(["New", "Contacted", "Closed"]),
});
