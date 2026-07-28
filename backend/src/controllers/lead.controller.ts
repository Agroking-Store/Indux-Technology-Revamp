import { Request, Response, NextFunction } from "express";
import Lead from "../models/Lead";
import ApiError from "../utils/ApiError";
import { createLeadSchema, updateLeadStatusSchema } from "../validators/lead.validator";
import { sendEmail } from "../utils/sendEmail";
import { getLeadEmailTemplate } from "../utils/emailTemplates";

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

    // Send auto-reply email
    const emailHtml = getLeadEmailTemplate(validatedData.name);

    // Fire and forget (or await if you want to block on email send)
    sendEmail({
      to: validatedData.email,
      subject: "We've received your inquiry - Indux Technology",
      html: emailHtml,
    }).catch(err => console.error("Email error:", err));

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const status = req.query.status as string;

    const filter: any = {};
    if (status && status !== "All") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: { total, page, limit }
      },
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
