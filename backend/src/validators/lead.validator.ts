import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  companyName: z.string().optional(),
  service: z.string().optional(),
  source: z.enum(["Get Quote", "Contact Us"]).optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(["New", "Contacted", "Closed"]),
});
