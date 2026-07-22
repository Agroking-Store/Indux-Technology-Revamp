import { Request, Response, NextFunction } from "express";
import Quote from "../models/Quote";
import ApiError from "../utils/ApiError";
import { createQuoteSchema, updateQuoteStatusSchema } from "../validators/quote.validator";
import { sendEmail } from "../utils/sendEmail";
import { getQuoteEmailTemplate } from "../utils/emailTemplates";

// @desc    Submit a new quote request (Public)
// @route   POST /api/v1/quotes
// @access  Public
export const createQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createQuoteSchema.parse(req.body);
    const quote = await Quote.create(validatedData);

    // Send auto-reply email
    const emailHtml = getQuoteEmailTemplate(validatedData.name, validatedData.serviceInterest, validatedData.companyName);

    sendEmail({
      to: validatedData.workEmail,
      subject: "Your Quote Request - Indux Technology",
      html: emailHtml,
    }).catch(err => console.error("Email error:", err));

    res.status(201).json({
      success: true,
      message: "Quote request submitted successfully",
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quotes (Admin only)
// @route   GET /api/v1/quotes
// @access  Private
export const getQuotes = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quote status (Admin only)
// @route   PATCH /api/v1/quotes/:id/status
// @access  Private
export const updateQuoteStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateQuoteStatusSchema.parse(req.body);

    const quote = await Quote.findByIdAndUpdate(
      id,
      { status: validatedData.status },
      { new: true, runValidators: true }
    );

    if (!quote) {
      return next(ApiError.notFound("Quote not found"));
    }

    res.status(200).json({
      success: true,
      message: "Quote status updated successfully",
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a quote (Admin only)
// @route   DELETE /api/v1/quotes/:id
// @access  Private
export const deleteQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const quote = await Quote.findByIdAndDelete(id);

    if (!quote) {
      return next(ApiError.notFound("Quote not found"));
    }

    res.status(200).json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
