import { Request, Response } from "express";
import Event from "../models/Event";
import { createEventSchema, updateEventSchema, updateEventStatusSchema } from "../validators/event.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

// Helper to generate slug if not provided
const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ============================
// CREATE EVENT
// ============================
export const createEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const file = req.file;
  if (!file) {
    throw ApiError.badRequest("Cover image is required");
  }

  // Convert image buffer to Base64 Data URL
  const image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  // Clean up empty form fields so they pass Zod validation
  if (req.body.slug === "") delete req.body.slug;

  // Validate body
  const validatedData = createEventSchema.parse(req.body);
  const { title, slug, ...rest } = validatedData;

  const finalSlug = slug || generateSlugFromTitle(title);

  // Check unique slug
  const existingEvent = await Event.findOne({ slug: finalSlug });
  if (existingEvent) {
    throw ApiError.conflict("Slug already exists");
  }

  // Create
  const event = await Event.create({
    title,
    slug: finalSlug,
    ...rest,
    image,
  });

  res.status(201).json(new ApiResponse(201, event, "Event created successfully"));
});

// ============================
// GET ALL EVENTS (with optional status filter)
// ============================
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string; // optional: Draft, Published

  const filter: any = {};
  if (status && (status === "Draft" || status === "Published")) {
    filter.status = status;
  }

  // Find all events and sort by date (closest/upcoming first)
  const events = await Event.find(filter).sort({ date: 1 });

  res.status(200).json(new ApiResponse(200, events, "Events fetched successfully"));
});

// ============================
// GET SINGLE EVENT
// ============================
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }
  res.status(200).json(new ApiResponse(200, event, "Event fetched successfully"));
});

// ============================
// UPDATE EVENT
// ============================
export const updateEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }

  if (req.body.slug === "") delete req.body.slug;

  const validatedData = updateEventSchema.parse(req.body);
  const { title, slug, ...rest } = validatedData;

  let finalSlug = slug;
  if (title && !slug) {
    finalSlug = generateSlugFromTitle(title);
  }

  // Unique check for updated slug
  if (finalSlug && finalSlug !== event.slug) {
    const existing = await Event.findOne({ slug: finalSlug, _id: { $ne: id } });
    if (existing) {
      throw ApiError.conflict("Slug already exists");
    }
  }

  let image = event.image;
  if (req.file) {
    image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(finalSlug && { slug: finalSlug }),
      ...rest,
      image,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
});

// ============================
// DELETE EVENT
// ============================
export const deleteEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }
  await event.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Event deleted successfully"));
});

// ============================
// UPDATE STATUS (TOGGLE PUBLISH)
// ============================
export const updateEventStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validated = updateEventStatusSchema.parse(req.body);
  const { status } = validated;

  const event = await Event.findById(id);
  if (!event) {
    throw ApiError.notFound("Event not found");
  }

  event.status = status;
  await event.save();

  res.status(200).json(new ApiResponse(200, event, `Event status updated to ${status}`));
});
