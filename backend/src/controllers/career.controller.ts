import { Request, Response } from "express";
import Career from "../models/Career";
import { createCareerSchema, updateCareerSchema, updateCareerStatusSchema } from "../validators/career.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

// ============================
// CREATE CAREER (Job Opening)
// ============================
export const createCareer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validated = createCareerSchema.parse(req.body);
  const career = await Career.create(validated);
  res.status(201).json(new ApiResponse(201, career, "Job created successfully"));
});

// ============================
// GET ALL CAREERS (with pagination & status filter)
// ============================
export const getCareers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string; // "Active" or "Closed"

  const filter: any = {};
  if (status && (status === "Active" || status === "Closed")) {
    filter.status = status;
  }

  const total = await Career.countDocuments(filter);
  const careers = await Career.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json(new ApiResponse(200, {
    careers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }, "Careers fetched successfully"));
});

// ============================
// GET SINGLE CAREER
// ============================
export const getCareerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const career = await Career.findById(id);
  if (!career) {
    throw ApiError.notFound("Job not found");
  }
  res.status(200).json(new ApiResponse(200, career, "Job fetched successfully"));
});

// ============================
// UPDATE CAREER
// ============================
export const updateCareer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validated = updateCareerSchema.parse(req.body);

  const career = await Career.findById(id);
  if (!career) {
    throw ApiError.notFound("Job not found");
  }

  const updatedCareer = await Career.findByIdAndUpdate(
    id,
    validated,
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, updatedCareer, "Job updated successfully"));
});

// ============================
// DELETE CAREER
// ============================
export const deleteCareer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const career = await Career.findById(id);
  if (!career) {
    throw ApiError.notFound("Job not found");
  }

  await career.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Job deleted successfully"));
});

// ============================
// TOGGLE CAREER STATUS (Active/Closed)
// ============================
export const updateCareerStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validated = updateCareerStatusSchema.parse(req.body);
  const { status } = validated;

  const career = await Career.findById(id);
  if (!career) {
    throw ApiError.notFound("Job not found");
  }

  career.status = status;
  await career.save();

  res.status(200).json(new ApiResponse(200, career, `Job status updated to ${status}`));
});