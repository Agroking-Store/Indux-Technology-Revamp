import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import JobApplication from "../models/JobApplication";
import Career from "../models/Career";
import { createApplicationSchema, updateApplicationStatusSchema } from "../validators/application.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";
import { env } from "../config/env";

// ============================
// SUBMIT JOB APPLICATION (Public)
// ============================
export const submitApplication = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("Resume PDF file is required");
  }

  // Parse input
  const validated = createApplicationSchema.parse(req.body);

  const targetJobId = validated.jobId || validated.careerId;
  if (!targetJobId) {
    throw ApiError.badRequest("Job ID is required");
  }

  // Check if target job opening exists
  const career = await Career.findById(targetJobId);
  if (!career || career.status !== "Active") {
    throw ApiError.notFound("Active job opening not found");
  }

  // Convert buffer to Base64 PDF Data URL
  const resumeBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  // Parse custom answers if sent as JSON string or object
  let parsedAnswers = {};
  if (validated.answers) {
    try {
      parsedAnswers = typeof validated.answers === "string" 
        ? JSON.parse(validated.answers) 
        : validated.answers;
    } catch (e) {
      // fallback
      parsedAnswers = {};
    }
  }

  const application = await JobApplication.create({
    jobId: targetJobId,
    candidateName: validated.candidateName || validated.fullName || "Candidate",
    email: validated.email,
    phone: validated.phone,
    experience: validated.experience,
    coverLetter: validated.coverLetter,
    portfolio: validated.portfolio,
    linkedin: validated.linkedin,
    github: validated.github,
    noticePeriod: validated.noticePeriod,
    expectedCTC: validated.expectedCTC,
    answers: parsedAnswers,
    resume: resumeBase64,
    status: "New",
  });

  res.status(201).json(new ApiResponse(201, application, "Application submitted successfully"));
});

// ============================
// GET ALL APPLICATIONS (Admin Only)
// ============================
export const getApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobId, careerId, status, search, date, department, location } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const query: any = {};
  
  const targetJobId = jobId || careerId;
  if (targetJobId) query.jobId = targetJobId;
  if (status) query.status = status;
  
  if (search) {
    query.$or = [
      { candidateName: { $regex: search as string, $options: "i" } },
      { email: { $regex: search as string, $options: "i" } },
    ];
  }

  if (date) {
    const start = new Date(date as string);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date as string);
    end.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: start, $lte: end };
  }

  // Filter based on populated Job attributes
  if (department || location) {
    const careerQuery: any = {};
    if (department) careerQuery.department = department;
    if (location) careerQuery.location = location;
    
    const careers = await Career.find(careerQuery).select("_id");
    const careerIds = careers.map(c => c._id);
    query.jobId = { $in: careerIds };
  }

  const totalCount = await JobApplication.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const applications = await JobApplication.find(query)
    .populate("jobId", "title department location")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200, 
      { 
        applications, 
        pagination: {
          total: totalCount,
          pages: totalPages,
          page,
          limit
        }
      }, 
      "Applications fetched successfully"
    )
  );
});

// ============================
// STREAM PDF RESUME (Admin & Secure)
// ============================
export const getResumeStream = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Accept token from Authorization header OR ?token= query param
  // (query param is required for iframes and <a download> links which can't set headers)
  let token: string | undefined;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (typeof req.query.token === "string" && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    throw ApiError.unauthorized("Not authorized: no token provided");
  }

  try {
    jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw ApiError.unauthorized("Not authorized: invalid or expired token");
  }

  // Retrieve base64 resume from MongoDB explicitly
  const application = await JobApplication.findById(id).select("+resume");
  if (!application) {
    throw ApiError.notFound("Application not found");
  }

  if (!application.resume) {
    throw ApiError.notFound("Resume file not found");
  }

  // Parse MIME type and Base64 string
  const matches = application.resume.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw ApiError.badRequest("Invalid resume file format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", `inline; filename="Resume-${application.candidateName.replace(/\s+/g, "_")}.pdf"`);
  res.status(200).send(buffer);
});

// ============================
// GET CANDIDATE DETAILS (Admin Only)
// ============================
export const getCandidateDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const application = await JobApplication.findById(id).populate("jobId");
  if (!application) {
    throw ApiError.notFound("Application not found");
  }
  res.status(200).json(new ApiResponse(200, application, "Candidate details fetched successfully"));
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

  application.status = validated.status as any;
  await application.save();

  res.status(200).json(new ApiResponse(200, application, `Application status updated to ${validated.status}`));
});

// ============================
// UPDATE APPLICATION NOTES (Admin Only)
// ============================
export const updateApplicationNotes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;

  const application = await JobApplication.findById(id);
  if (!application) {
    throw ApiError.notFound("Application not found");
  }

  application.notes = notes || "";
  await application.save();

  res.status(200).json(new ApiResponse(200, application, "Application internal notes updated successfully"));
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

// ============================
// EXPORT APPLICATIONS TO CSV (Admin Only)
// ============================
export const exportApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobId, careerId, status, search, date } = req.query;

  const query: any = {};
  const targetJobId = jobId || careerId;
  if (targetJobId) query.jobId = targetJobId;
  if (status) query.status = status;
  
  if (search) {
    query.$or = [
      { candidateName: { $regex: search as string, $options: "i" } },
      { email: { $regex: search as string, $options: "i" } },
    ];
  }

  if (date) {
    const start = new Date(date as string);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date as string);
    end.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: start, $lte: end };
  }

  const applications = await JobApplication.find(query)
    .populate("jobId", "title department location")
    .sort({ createdAt: -1 });

  // Generate CSV
  let csv = "Candidate Name,Email,Phone,Applied Job,Department,Location,Experience,Portfolio,LinkedIn,GitHub,Notice Period,Expected CTC,Status,Applied Date,Notes\n";

  for (const app of applications) {
    const job = app.jobId as any;
    const name = `"${(app.candidateName || "").replace(/"/g, '""')}"`;
    const email = `"${(app.email || "").replace(/"/g, '""')}"`;
    const phone = `"${(app.phone || "").replace(/"/g, '""')}"`;
    const jobTitle = `"${(job?.title || "Unknown").replace(/"/g, '""')}"`;
    const dept = `"${(job?.department || "").replace(/"/g, '""')}"`;
    const loc = `"${(job?.location || "").replace(/"/g, '""')}"`;
    const exp = `"${(app.experience || "").replace(/"/g, '""')}"`;
    const port = `"${(app.portfolio || "").replace(/"/g, '""')}"`;
    const li = `"${(app.linkedin || "").replace(/"/g, '""')}"`;
    const gh = `"${(app.github || "").replace(/"/g, '""')}"`;
    const notice = `"${(app.noticePeriod || "").replace(/"/g, '""')}"`;
    const ctc = `"${(app.expectedCTC || "").replace(/"/g, '""')}"`;
    const stat = `"${app.status}"`;
    const appliedAt = `"${new Date(app.createdAt).toLocaleDateString()}"`;
    const notesStr = `"${(app.notes || "").replace(/\n/g, " ").replace(/"/g, '""')}"`;

    csv += `${name},${email},${phone},${jobTitle},${dept},${loc},${exp},${port},${li},${gh},${notice},${ctc},${stat},${appliedAt},${notesStr}\n`;
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=applications_export.csv");
  res.status(200).send(csv);
});