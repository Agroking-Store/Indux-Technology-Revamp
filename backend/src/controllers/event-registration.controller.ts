import { Request, Response } from "express";
import Event from "../models/Event";
import EventRegistration from "../models/EventRegistration";
import { 
  createRegistrationSchema, 
  updateRegistrationStatusSchema, 
  updateRegistrationNotesSchema 
} from "../validators/event-registration.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

// ============================
// PUBLIC: CREATE EVENT REGISTRATION
// ============================
export const createRegistration = asyncHandler(async (req: Request, res: Response) => {
  // Validate base parameters
  const validated = createRegistrationSchema.parse(req.body);
  const { eventId, name, email, phone, answers } = validated;

  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }

  if (event.status !== "Published") {
    throw ApiError.badRequest("Cannot register for an unpublished event");
  }

  // Check registration deadline
  if (new Date() > new Date(event.registrationDeadline)) {
    throw ApiError.badRequest("Registration deadline has passed for this event");
  }

  // Check unique registration (email per event)
  const existing = await EventRegistration.findOne({ eventId, email });
  if (existing) {
    throw ApiError.conflict("You have already registered for this event using this email address");
  }

  // Parse custom answers
  const answersObj = { ...answers };

  // If file uploaded via multer, convert to base64 Data URL
  if (req.file) {
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    // Find the file-type field in event formFields and map to it
    const fileField = event.formFields.find(f => f.type === "file");
    if (fileField) {
      answersObj[fileField.name] = fileBase64;
    }
  }

  // Validate custom required fields (skip base fields — their values live in
  // the top-level name/email/phone params, not in `answers`)
  for (const field of event.formFields) {
    if (field.name === "name" || field.name === "email" || field.name === "phone") continue;

    const val = answersObj[field.name];
    if (field.required) {
      const isEmpty = val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0);
      if (isEmpty) {
        throw ApiError.badRequest(`Custom field "${field.label}" is required`);
      }
    }
  }

  // Create
  const registration = await EventRegistration.create({
    eventId,
    name,
    email,
    phone,
    answers: answersObj,
    status: "Pending",
  });

  res.status(201).json(new ApiResponse(201, registration, "Registered successfully"));
});

// ============================
// ADMIN: GET REGISTRATIONS (with search & filters & pagination)
// ============================
export const getRegistrations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, eventId, status, search, date } = req.query;

  const filter: any = {};
  if (eventId) {
    filter.eventId = eventId;
  }
  if (status) {
    filter.status = status;
  }
  if (date) {
    const start = new Date(date as string);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date as string);
    end.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await EventRegistration.countDocuments(filter);
  const registrations = await EventRegistration.find(filter)
    .populate("eventId", "title type startDate")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        registrations,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Registrations fetched successfully"
    )
  );
});

// ============================
// ADMIN: GET REGISTRATION BY ID
// ============================
export const getRegistrationById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const registration = await EventRegistration.findById(id).populate("eventId", "title type startDate formFields");
  if (!registration) {
    throw ApiError.notFound("Registration not found");
  }
  res.status(200).json(new ApiResponse(200, registration, "Registration details fetched"));
});

// ============================
// ADMIN: UPDATE REGISTRATION STATUS
// ============================
export const updateRegistrationStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validated = updateRegistrationStatusSchema.parse(req.body);
  const { status } = validated;

  const registration = await EventRegistration.findById(id);
  if (!registration) {
    throw ApiError.notFound("Registration not found");
  }

  registration.status = status;
  await registration.save();

  res.status(200).json(new ApiResponse(200, registration, `Registration status updated to ${status}`));
});

// ============================
// ADMIN: UPDATE REGISTRATION NOTES
// ============================
export const updateRegistrationNotes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validated = updateRegistrationNotesSchema.parse(req.body);
  const { notes } = validated;

  const registration = await EventRegistration.findById(id);
  if (!registration) {
    throw ApiError.notFound("Registration not found");
  }

  registration.notes = notes;
  await registration.save();

  res.status(200).json(new ApiResponse(200, registration, "Registration notes updated"));
});

// ============================
// ADMIN: DELETE REGISTRATION
// ============================
export const deleteRegistration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const registration = await EventRegistration.findById(id);
  if (!registration) {
    throw ApiError.notFound("Registration not found");
  }

  await registration.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Registration deleted successfully"));
});

// ============================
// ADMIN: EXPORT REGISTRATIONS AS CSV
// ============================
export const exportRegistrationsToCSV = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { eventId } = req.params;
  
  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }

  const registrations = await EventRegistration.find({ eventId }).sort({ createdAt: -1 });

  // CSV Headers: standard fields + custom dynamic fields
  const headers = ["Name", "Email", "Phone", "Registration Date", "Status", "Notes"];
  const customFieldNames = event.formFields.map(f => f.name);
  const customFieldLabels = event.formFields.map(f => f.label);

  const allHeaders = [...headers, ...customFieldLabels];

  // Map to CSV row cells (handling double quotes escaping)
  let csvContent = allHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";

  for (const reg of registrations) {
    const row = [
      reg.name,
      reg.email,
      reg.phone,
      reg.createdAt.toISOString(),
      reg.status,
      reg.notes || "",
    ];
    for (const name of customFieldNames) {
      const ansVal = reg.answers[name];
      let valStr = "";
      if (ansVal !== undefined && ansVal !== null) {
        if (typeof ansVal === "object") {
          valStr = JSON.stringify(ansVal);
        } else {
          valStr = String(ansVal);
        }
      }
      row.push(valStr);
    }
    csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${event.slug}-registrations.csv"`);
  res.status(200).send(csvContent);
});