import { Request, Response } from "express";
import JobApplication from "../models/JobApplication";
import Career from "../models/Career";
import { createApplicationSchema, updateApplicationStatusSchema } from "../validators/application.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

// ============================
// SUBMIT JOB APPLICATION (Public)
// ============================
export const submitApplication = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("Resume PDF file is required");
  }

  // Parse input
  const validated = createApplicationSchema.parse(req.body);

  // Check if target career opening exists
  const career = await Career.findById(validated.careerId);
  if (!career || career.status !== "Active") {
    throw ApiError.notFound("Active job opening not found");
  }

  // Convert buffer to Base64 PDF Data URL
  const resumeBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  const application = await JobApplication.create({
    ...validated,
    resume: resumeBase64,
  });

  res.status(201).json(new ApiResponse(201, application, "Application submitted successfully"));
});

// ============================
// GET ALL APPLICATIONS (Admin Only)
// ============================
export const getApplications = asyncHandler(async (_req: AuthRequest, res: Response) => {
  // Fetch all applications and populate the career details
  const applications = await JobApplication.find()
    .populate("careerId", "title department location")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { applications }, "Applications fetched successfully"));
});

// ============================
// UPDATE APPLICATION STATUS (Admin Only)
// ============================
export const updateApplicationStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validated = updateApplicationStatusSchema.parse(req.body);

  const application = await JobApplication.findById(id);
  if (!application) {
    throw ApiError.notFound("Application not found");
  }

  application.status = validated.status;
  await application.save();

  res.status(200).json(new ApiResponse(200, application, `Application status updated to ${validated.status}`));
});

// ============================
// DELETE APPLICATION (Admin Only)
// ============================
export const deleteApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const application = await JobApplication.findById(id);
  if (!application) {
    throw ApiError.notFound("Application not found");
  }

  await application.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Application deleted successfully"));
});