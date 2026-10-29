import { Request, Response } from "express";
import mongoose from "mongoose";
import CaseStudy from "../models/CaseStudy";
import {
  createCaseStudySchema,
  updateCaseStudySchema,
  updateCaseStudyStatusSchema,
} from "../validators/case-study.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

// Helper to generate slug from name
const generateSlugFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ============================
// CREATE CASE STUDY
// ============================
export const createCaseStudy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Clean up empty form fields so they pass Zod validation
    if (req.body.slug === "") delete req.body.slug;
    if (req.body.image === "") delete req.body.image;

    // Handle file upload if present
    if (req.file) {
      req.body.image = `/uploads/case-studies/${req.file.filename}`;
    }

    // Validate request body
    const validatedData = createCaseStudySchema.parse(req.body);
    const { name, slug, ...rest } = validatedData;

    // Generate slug if not provided
    const finalSlug = slug || generateSlugFromName(name);

    // Check if slug already exists
    const existingCaseStudy = await CaseStudy.findOne({ slug: finalSlug });
    if (existingCaseStudy) {
      throw ApiError.conflict("A case study with this slug or name already exists");
    }

    const caseStudy = await CaseStudy.create({
      name,
      slug: finalSlug,
      ...rest,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, caseStudy, "Case study created successfully")
      );
  }
);

// ============================
// GET ALL CASE STUDIES (with pagination & filtering)
// ============================
export const getCaseStudies = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const filter: any = {};
    if (status && (status === "Draft" || status === "Published")) {
      filter.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { headline: searchRegex },
        { challenge: searchRegex },
        { solution: searchRegex },
        { result: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [caseStudies, totalCount] = await Promise.all([
      CaseStudy.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CaseStudy.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          caseStudies,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
          },
        },
        "Case studies fetched successfully"
      )
    );
  }
);

// ============================
// GET CASE STUDY BY ID OR SLUG
// ============================
export const getCaseStudyById = asyncHandler(
  async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    let caseStudy = null;
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      caseStudy = await CaseStudy.findById(id).lean();
    }

    if (!caseStudy) {
      caseStudy = await CaseStudy.findOne({ slug: id }).lean();
    }

    if (!caseStudy) {
      throw ApiError.notFound("Case study not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, caseStudy, "Case study fetched successfully"));
  }
);

// ============================
// UPDATE CASE STUDY
// ============================
export const updateCaseStudy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      throw ApiError.notFound("Case study not found");
    }

    if (req.body.slug === "") delete req.body.slug;

    // Handle new uploaded image
    if (req.file) {
      req.body.image = `/uploads/case-studies/${req.file.filename}`;
    } else if (req.body.removeImage === "true" || req.body.removeImage === true) {
      req.body.image = "";
    }

    // Validate body
    const validatedData = updateCaseStudySchema.parse(req.body);
    const { name, slug, ...rest } = validatedData;

    let finalSlug = slug;
    if (name && !slug) {
      finalSlug = generateSlugFromName(name);
    }

    if (finalSlug && finalSlug !== caseStudy.slug) {
      const existing = await CaseStudy.findOne({
        slug: finalSlug,
        _id: { $ne: id },
      });
      if (existing) {
        throw ApiError.conflict("Slug already exists");
      }
    }

    const updated = await CaseStudy.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(finalSlug && { slug: finalSlug }),
        ...rest,
      },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updated, "Case study updated successfully"));
  }
);

// ============================
// DELETE CASE STUDY
// ============================
export const deleteCaseStudy = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      throw ApiError.notFound("Case study not found");
    }

    await CaseStudy.findByIdAndDelete(id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Case study deleted successfully"));
  }
);

// ============================
// UPDATE CASE STUDY STATUS (Draft / Published)
// ============================
export const updateCaseStudyStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = updateCaseStudyStatusSchema.parse(req.body);

    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      throw ApiError.notFound("Case study not found");
    }

    caseStudy.status = status;
    await caseStudy.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          caseStudy,
          `Case study status updated to ${status}`
        )
      );
  }
);

// ============================
// INCREMENT VIEWS
// ============================
export const incrementCaseStudyViews = asyncHandler(
  async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    let caseStudy = null;
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      caseStudy = await CaseStudy.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
    } else {
      caseStudy = await CaseStudy.findOneAndUpdate(
        { slug: id },
        { $inc: { views: 1 } },
        { new: true }
      );
    }

    if (!caseStudy) {
      throw ApiError.notFound("Case study not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { views: caseStudy.views }, "Views incremented"));
  }
);
