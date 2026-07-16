import { Request, Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import Event from "../models/Event";
import EventRegistration from "../models/EventRegistration";
import { 
  createRegistrationSchema, 
  updateRegistrationStatusSchema, 
  updateRegistrationNotesSchema,
  verifyPaymentSchema
} from "../validators/event-registration.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";
import { env } from "../config/env";
import razorpay from "../config/razorpay";

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
    if (existing.paymentStatus === "Pending") {
      // Clean up the incomplete/unpaid registration so the user can re-initiate checkout
      await EventRegistration.deleteOne({ _id: existing._id });
    } else {
      throw ApiError.conflict("You have already registered for this event using this email address");
    }
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

  // Check if event is paid
  const isPaidEvent = event.isPaid && event.registrationFee > 0;
  let razorpayOrderId: string | undefined;

  if (isPaidEvent) {
    const isDummyCredentials = 
      !env.RAZORPAY_KEY_ID || 
      !env.RAZORPAY_KEY_SECRET ||
      env.RAZORPAY_KEY_ID.toLowerCase().includes("placeholder") ||
      env.RAZORPAY_KEY_ID.toLowerCase().includes("your_") ||
      env.RAZORPAY_KEY_SECRET.toLowerCase().includes("placeholder") ||
      env.RAZORPAY_KEY_SECRET.toLowerCase().includes("your_");

    if (razorpay && !isDummyCredentials) {
      try {
        const order = await razorpay.orders.create({
          amount: Math.round(event.registrationFee * 100), // amount in paise
          currency: "INR",
          receipt: `receipt_reg_${Date.now()}`,
        });
        razorpayOrderId = order.id;
      } catch (error) {
        console.error("Failed to create Razorpay order:", error);
        const isProduction = process.env.NODE_ENV === "production";
        if (!isProduction) {
          console.warn("⚠️ Razorpay API error. Falling back to stub mode since NODE_ENV is not production.");
          razorpayOrderId = `order_stub_${Math.random().toString(36).substring(2, 10)}`;
        } else {
          throw ApiError.internal("Failed to initialize payment gateway");
        }
      }
    } else {
      console.warn("⚠️ Razorpay SDK not initialized or using placeholder credentials, generating stub Order ID");
      razorpayOrderId = `order_stub_${Math.random().toString(36).substring(2, 10)}`;
    }
  }

  // Create
  const registration = await EventRegistration.create({
    eventId,
    name,
    email,
    phone,
    answers: answersObj,
    status: isPaidEvent ? "Pending" : "Approved", // Free events are approved automatically
    paymentStatus: isPaidEvent ? "Pending" : "None",
    razorpayOrderId,
    amountPaid: isPaidEvent ? event.registrationFee : 0,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        registration,
        razorpayOrderId,
        razorpayKeyId: env.RAZORPAY_KEY_ID || "rzp_test_stub_key",
        isPaid: isPaidEvent,
      },
      isPaidEvent ? "Registration initialized. Payment required." : "Registered successfully"
    )
  );
});

// ============================
// ADMIN: GET REGISTRATIONS (with search & filters & pagination)
// ============================
export const getRegistrations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, eventId, status, search, date } = req.query;

  const filter: any = {};
  // Exclude uncompleted pending registrations from list
  filter.paymentStatus = { $ne: "Pending" };
  
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

// ============================
// PUBLIC: VERIFY PAYMENT (RAZORPAY SIGNATURE CHECK)
// ============================
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const validated = verifyPaymentSchema.parse(req.body);
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = validated;

  // Find registration by orderId
  const registration = await EventRegistration.findOne({ razorpayOrderId });
  if (!registration) {
    throw ApiError.notFound("Registration not found for this order");
  }

  // If order was a stub (mock testing), bypass signature check
  const isStubOrder = razorpayOrderId.startsWith("order_stub_");

  if (!isStubOrder) {
    if (!env.RAZORPAY_KEY_SECRET) {
      throw ApiError.internal("Payment gateway secret key is not configured");
    }

    const hmac = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpaySignature) {
      registration.paymentStatus = "Failed";
      await registration.save();
      throw ApiError.badRequest("Invalid payment signature verification failed");
    }
  } else {
    console.log("Mock Payment Verification Approved for stub order ID:", razorpayOrderId);
  }

  // Update status
  registration.paymentStatus = "Paid";
  registration.status = "Approved";
  registration.razorpayPaymentId = razorpayPaymentId;
  registration.razorpaySignature = razorpaySignature;

  await registration.save();

  res.status(200).json(new ApiResponse(200, registration, "Payment verified and registration approved successfully"));
});

// ============================
// PUBLIC: CANCEL/CLEANUP PENDING REGISTRATION
// ============================
export const cancelRegistration = asyncHandler(async (req: Request, res: Response) => {
  const { razorpayOrderId } = z.object({ razorpayOrderId: z.string() }).parse(req.body);
  await EventRegistration.deleteOne({ razorpayOrderId, paymentStatus: "Pending" });
  res.status(200).json(new ApiResponse(200, null, "Pending registration cleaned up successfully"));
});