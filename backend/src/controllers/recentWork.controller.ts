import { Request, Response } from "express";
import mongoose from "mongoose";
import RecentWork from "../models/RecentWork";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const parseJsonField = (field: any, defaultValue: any) => {
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return defaultValue;
    }
  }
  return field ?? defaultValue;
};

// ============================
// GET ALL RECENT WORKS
// ============================
export const getRecentWorks = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 100;
  const status = req.query.status as string;
  const category = req.query.category as string;
  const search = req.query.search as string;

  const filter: any = {};

  if (status && (status === "Draft" || status === "Published")) {
    filter.status = status;
  }
  if (category && category !== "All") {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { client: { $regex: search, $options: "i" } },
      { shortDescription: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [recentWorks, total] = await Promise.all([
    RecentWork.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
    RecentWork.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        recentWorks,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      "Recent works fetched successfully"
    )
  );
});

// ============================
// GET RECENT WORK BY SLUG OR ID
// ============================
export const getRecentWorkBySlugOrId = asyncHandler(async (req: Request, res: Response) => {
  const rawId = req.params.identifier;
  const identifier = Array.isArray(rawId) ? rawId[0] : rawId;

  let work = null;
  if (identifier && mongoose.Types.ObjectId.isValid(identifier)) {
    work = await RecentWork.findById(identifier);
  }

  if (!work && identifier) {
    work = await RecentWork.findOne({ slug: identifier });
  }

  if (!work) {
    throw ApiError.notFound("Recent work project not found");
  }

  res.status(200).json(new ApiResponse(200, work, "Recent work project fetched successfully"));
});

// ============================
// CREATE RECENT WORK (Admin)
// ============================
export const createRecentWork = asyncHandler(async (req: AuthRequest, res: Response) => {
  const body = { ...req.body };

  body.highlights = parseJsonField(body.highlights, []);
  body.technologies = parseJsonField(body.technologies, []);
  body.metrics = parseJsonField(body.metrics, []);

  if (req.file) {
    body.image = `/uploads/recent-works/${req.file.filename}`;
  }

  if (!body.image) {
    throw ApiError.badRequest("Project image is required");
  }

  if (!body.title || !body.tagline || !body.category || !body.client || !body.shortDescription || !body.fullDescription) {
    throw ApiError.badRequest("Title, tagline, category, client, and descriptions are required");
  }

  const finalSlug = body.slug ? body.slug.toLowerCase().trim() : generateSlugFromTitle(body.title);

  const existing = await RecentWork.findOne({ slug: finalSlug });
  if (existing) {
    throw ApiError.conflict(`Project with slug '${finalSlug}' already exists`);
  }

  body.slug = finalSlug;

  const work = await RecentWork.create(body);

  res.status(201).json(new ApiResponse(201, work, "Recent work project created successfully"));
});

// ============================
// UPDATE RECENT WORK (Admin)
// ============================
export const updateRecentWork = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const body = { ...req.body };

  if (body.highlights !== undefined) body.highlights = parseJsonField(body.highlights, []);
  if (body.technologies !== undefined) body.technologies = parseJsonField(body.technologies, []);
  if (body.metrics !== undefined) body.metrics = parseJsonField(body.metrics, []);

  if (req.file) {
    body.image = `/uploads/recent-works/${req.file.filename}`;
  }

  if (body.slug) {
    body.slug = body.slug.toLowerCase().trim();
    const existing = await RecentWork.findOne({ slug: body.slug, _id: { $ne: id } });
    if (existing) {
      throw ApiError.conflict(`Slug '${body.slug}' is already in use`);
    }
  }

  const work = await RecentWork.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!work) {
    throw ApiError.notFound("Recent work project not found");
  }

  res.status(200).json(new ApiResponse(200, work, "Recent work project updated successfully"));
});

// ============================
// DELETE RECENT WORK (Admin)
// ============================
export const deleteRecentWork = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const work = await RecentWork.findByIdAndDelete(id);
  if (!work) {
    throw ApiError.notFound("Recent work project not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Recent work project deleted successfully"));
});

// ============================
// UPDATE RECENT WORK STATUS (Admin)
// ============================
export const updateRecentWorkStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== "Draft" && status !== "Published") {
    throw ApiError.badRequest("Status must be either 'Draft' or 'Published'");
  }

  const work = await RecentWork.findByIdAndUpdate(id, { status }, { new: true });
  if (!work) {
    throw ApiError.notFound("Recent work project not found");
  }

  res.status(200).json(new ApiResponse(200, work, "Status updated successfully"));
});
