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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const serviceInterest = req.query.serviceInterest as string;

    const filter: any = {};
    if (status && status !== "All") {
      filter.status = status;
    }
    
    if (serviceInterest && serviceInterest !== "All") {
      filter.serviceInterest = serviceInterest;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Create a flexible regex for phone search that ignores spaces.
      // e.g. "+141" becomes "\+\s*1\s*4\s*1"
      const phoneRegexStr = search.replace(/\s+/g, '').split('').map(char => {
        return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }).join('\\s*');

      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { workEmail: { $regex: escapedSearch, $options: "i" } },
        { companyName: { $regex: escapedSearch, $options: "i" } },
        { phone: { $regex: phoneRegexStr, $options: "i" } },
        { serviceInterest: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const total = await Quote.countDocuments(filter);
    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        quotes,
        pagination: { total, page, limit }
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quote by ID
// @route   GET /api/v1/quotes/:id
// @access  Private
export const getQuoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const quote = await Quote.findById(id);

    if (!quote) {
      return next(ApiError.notFound("Quote not found"));
    }

    res.status(200).json({
      success: true,
      data: quote,
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
