import { Request, Response } from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import TeamMember from "../models/TeamMember";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

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
// GET ALL PUBLISHED TEAM MEMBERS (Public)
// ============================
export const getTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const department = req.query.department as string;

  const filter: any = { status: "Published" };
  if (department && department !== "All") {
    filter.department = department;
  }

  const teamMembers = await TeamMember.find(filter).sort({ order: 1, createdAt: 1 });

  res.status(200).json(
    new ApiResponse(200, teamMembers, "Team members fetched successfully")
  );
});

// ============================
// GET TEAM MEMBERS (Admin with Pagination & Filters)
// ============================
export const getAdminTeamMembers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 100;
  const status = req.query.status as string;
  const department = req.query.department as string;
  const search = req.query.search as string;

  const filter: any = {};

  if (status && (status === "Draft" || status === "Published")) {
    filter.status = status;
  }
  if (department && department !== "All") {
    filter.department = department;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { bio: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [teamMembers, total] = await Promise.all([
    TeamMember.find(filter).sort({ order: 1, createdAt: 1 }).skip(skip).limit(limit),
    TeamMember.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        teamMembers,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      "Admin team members fetched successfully"
    )
  );
});

// ============================
// GET TEAM MEMBER BY ID
// ============================
export const getTeamMemberById = asyncHandler(async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid team member ID");
  }

  const member = await TeamMember.findById(id);
  if (!member) {
    throw ApiError.notFound("Team member not found");
  }

  res.status(200).json(new ApiResponse(200, member, "Team member fetched successfully"));
});

// ============================
// CREATE TEAM MEMBER (Admin)
// ============================
export const createTeamMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const body = { ...req.body };

  body.socialLinks = parseJsonField(body.socialLinks, {
    linkedin: body.linkedin || "",
    twitter: body.twitter || "",
    github: body.github || "",
    email: body.email || "",
  });

  if (req.file) {
    body.image = `/uploads/team/${req.file.filename}`;
  }

  if (!body.image) {
    throw ApiError.badRequest("Team member photo is required");
  }

  if (!body.name || !body.role) {
    throw ApiError.badRequest("Name and role are required");
  }

  if (body.order !== undefined) {
    body.order = Number(body.order) || 0;
  }

  const member = await TeamMember.create(body);

  res.status(201).json(new ApiResponse(201, member, "Team member created successfully"));
});

// ============================
// UPDATE TEAM MEMBER (Admin)
// ============================
export const updateTeamMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const body = { ...req.body };

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid team member ID");
  }

  if (body.socialLinks !== undefined) {
    body.socialLinks = parseJsonField(body.socialLinks, {
      linkedin: body.linkedin || "",
      twitter: body.twitter || "",
      github: body.github || "",
      email: body.email || "",
    });
  }

  if (req.file) {
    body.image = `/uploads/team/${req.file.filename}`;
  }

  if (body.order !== undefined) {
    body.order = Number(body.order) || 0;
  }

  const existing = await TeamMember.findById(id);
  if (!existing) {
    throw ApiError.notFound("Team member not found");
  }

  // If a new image was uploaded and previous image was local file, optionally delete old image
  if (req.file && existing.image && existing.image.startsWith("/uploads/team/")) {
    try {
      const oldFilename = existing.image.replace("/uploads/team/", "");
      const oldPath = path.join(__dirname, "../../uploads/team", oldFilename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    } catch (e) {
      console.warn("Could not delete old member photo:", e);
    }
  }

  const member = await TeamMember.findByIdAndUpdate(id, body, { new: true, runValidators: true });

  res.status(200).json(new ApiResponse(200, member, "Team member updated successfully"));
});

// ============================
// DELETE TEAM MEMBER (Admin)
// ============================
export const deleteTeamMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid team member ID");
  }

  const member = await TeamMember.findByIdAndDelete(id);
  if (!member) {
    throw ApiError.notFound("Team member not found");
  }

  if (member.image && member.image.startsWith("/uploads/team/")) {
    try {
      const filename = member.image.replace("/uploads/team/", "");
      const filePath = path.join(__dirname, "../../uploads/team", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.warn("Could not delete member photo on delete:", e);
    }
  }

  res.status(200).json(new ApiResponse(200, null, "Team member deleted successfully"));
});

// ============================
// UPDATE TEAM MEMBER STATUS (Admin)
// ============================
export const updateTeamMemberStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { status } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid team member ID");
  }

  if (status !== "Draft" && status !== "Published") {
    throw ApiError.badRequest("Status must be either 'Draft' or 'Published'");
  }

  const member = await TeamMember.findByIdAndUpdate(id, { status }, { new: true });
  if (!member) {
    throw ApiError.notFound("Team member not found");
  }

  res.status(200).json(new ApiResponse(200, member, "Status updated successfully"));
});
