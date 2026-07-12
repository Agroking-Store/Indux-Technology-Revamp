import { Request, Response, NextFunction } from "express";
import Lead from "../models/Lead";
import ApiError from "../utils/ApiError";
import { createLeadSchema, updateLeadStatusSchema } from "../validators/lead.validator";

// @desc    Submit a new contact lead (Public)
// @route   POST /api/v1/leads
// @access  Public
export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createLeadSchema.parse(req.body);
    const lead = await Lead.create(validatedData);
    res.status(201).json({
      success: true,
      message: "Lead submitted successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact leads (Admin only)
// @route   GET /api/v1/leads
// @access  Private
export const getLeads = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status (Admin only)
// @route   PATCH /api/v1/leads/:id/status
// @access  Private
export const updateLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateLeadStatusSchema.parse(req.body);

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status: validatedData.status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return next(ApiError.notFound("Lead not found"));
    }

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead (Admin only)
// @route   DELETE /api/v1/leads/:id
// @access  Private
export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return next(ApiError.notFound("Lead not found"));
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
