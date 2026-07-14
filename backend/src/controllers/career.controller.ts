import { Request, Response } from "express";
import Career from "../models/Career";
import JobApplication from "../models/JobApplication";
import { createCareerSchema, updateCareerSchema, updateCareerStatusSchema } from "../validators/career.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

// Helper to generate slug from title
const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ============================
// CREATE CAREER (Job Opening)
// ============================
export const createCareer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validated = createCareerSchema.parse(req.body);
  
  // Generate slug if not provided
  let finalSlug = validated.slug || generateSlugFromTitle(validated.title);
  
  // Check unique slug
  let count = 1;
  const originalSlug = finalSlug;
  while (await Career.findOne({ slug: finalSlug })) {
    finalSlug = `${originalSlug}-${count++}`;
  }

  const career = await Career.create({
    ...validated,
    slug: finalSlug,
  });

  res.status(201).json(new ApiResponse(201, career, "Job created successfully"));
});

// ============================
// GET ALL CAREERS (with pagination & status filter)
// ============================
export const getCareers = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const status = req.query.status as string; // "Active" or "Closed"

  const filter: any = {};
  if (status && (status === "Active" || status === "Closed")) {
    filter.status = status;
  }

  const total = await Career.countDocuments(filter);
  
  let query = Career.find(filter).sort({ createdAt: -1 });
  if (page && limit) {
    query = query.skip((page - 1) * limit).limit(limit);
  }
  const careers = await query;

  // Map counts of applications for each job
  const careersWithCounts = await Promise.all(
    careers.map(async (c) => {
      const appCount = await JobApplication.countDocuments({ jobId: c._id });
      return {
        ...c.toObject(),
        applicationsCount: appCount,
      };
    })
  );

  res.status(200).json(
    new ApiResponse(200, {
      careers: careersWithCounts,
      pagination: {
        page: page || 1,
        limit: limit || total,
        total,
        pages: limit ? Math.ceil(total / limit) : 1,
      },
    }, "Careers fetched successfully")
  );
});

// ============================
// GET SINGLE CAREER
// ============================
export const getCareerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Find by ID or Slug
  let career = await Career.findById(id);
  if (!career) {
    career = await Career.findOne({ slug: id });
  }

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

  // If title is updated and no custom slug is provided, regenerate slug
  if (validated.title && !validated.slug) {
    validated.slug = generateSlugFromTitle(validated.title);
  }

  // If slug changed, ensure uniqueness
  if (validated.slug && validated.slug !== career.slug) {
    let finalSlug = validated.slug;
    let count = 1;
    const originalSlug = finalSlug;
    while (await Career.findOne({ slug: finalSlug, _id: { $ne: id } })) {
      finalSlug = `${originalSlug}-${count++}`;
    }
    validated.slug = finalSlug;
  }

  const updatedCareer = await Career.findByIdAndUpdate(
    id,
    validated,
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, updatedCareer, "Job updated successfully"));
});

// ============================
// DUPLICATE CAREER (Job Opening)
// ============================
export const duplicateCareer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const career = await Career.findById(id);
  if (!career) {
    throw ApiError.notFound("Job not found");
  }

  const duplicatedData = {
    title: `${career.title} (Copy)`,
    department: career.department,
    location: career.location,
    employmentType: career.employmentType,
    experience: career.experience,
    openings: career.openings,
    description: career.description,
    responsibilities: career.responsibilities,
    requirements: career.requirements,
    benefits: career.benefits,
    skills: career.skills,
    salary: career.salary,
    status: "Closed" as "Active" | "Closed", // duplicated drafts default to Closed
    formFields: career.formFields,
    lastDate: career.lastDate,
  };

  // Generate unique slug
  let finalSlug = generateSlugFromTitle(duplicatedData.title);
  let count = 1;
  const originalSlug = finalSlug;
  while (await Career.findOne({ slug: finalSlug })) {
    finalSlug = `${originalSlug}-${count++}`;
  }
  (duplicatedData as any).slug = finalSlug;

  const newCareer = await Career.create(duplicatedData);
  res.status(201).json(new ApiResponse(201, newCareer, "Job duplicated successfully"));
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

  // Optional: delete all applications linked to this career opening
  await JobApplication.deleteMany({ jobId: id });

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