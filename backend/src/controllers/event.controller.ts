import { Request, Response } from "express";
import Event from "../models/Event";
import EventRegistration from "../models/EventRegistration";
import { createEventSchema, updateEventSchema, updateEventStatusSchema } from "../validators/event.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";
import { deleteFromCloudinary } from "../services/cloudinary";

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
  // Clean up empty form fields so they pass Zod validation
  if (req.body.slug === "") delete req.body.slug;

  // Validate body (coverImage/bannerImage are pasted URLs, not uploaded files)
  const validatedData = createEventSchema.parse(req.body);
  const { title, slug, coverImage, bannerImage, ...rest } = validatedData;

  const finalSlug = slug || generateSlugFromTitle(title);

  // Check unique slug
  const existingEvent = await Event.findOne({ slug: finalSlug });
  if (existingEvent) {
    throw ApiError.conflict("Slug already exists");
  }

  const event = await Event.create({
    title,
    slug: finalSlug,
    ...rest,
    coverImage,
    bannerImage,
    // Backward compatibility fields
    image: coverImage,
    date: rest.startDate,
    content: rest.description,
  });

  res.status(201).json(new ApiResponse(201, event, "Event created successfully"));
});

// ============================
// GET ALL EVENTS (with optional status filter & registrations count)
// ============================
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string; // optional: Draft, Published

  const filter: any = {};
  if (status && (status === "Draft" || status === "Published")) {
    filter.status = status;
  }

  // Find all events and sort by startDate (closest/upcoming first)
  const events = await Event.find(filter).sort({ startDate: 1 });

  // Add registrationsCount dynamically
  const eventsWithCount = await Promise.all(
    events.map(async (event) => {
      const registrationsCount = await EventRegistration.countDocuments({ eventId: event._id });
      return {
        ...event.toObject(),
        registrationsCount,
      };
    })
  );

  res.status(200).json(new ApiResponse(200, eventsWithCount, "Events fetched successfully"));
});

// ============================
// GET SINGLE EVENT BY ID OR SLUG
// ============================
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Find by ID or by Slug
  let event;
  if (typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)) {
    event = await Event.findById(id);
  } else {
    event = await Event.findOne({ slug: id });
  }

  if (!event) {
    throw ApiError.notFound("Event not found");
  }

  const registrationsCount = await EventRegistration.countDocuments({ eventId: event._id });
  const eventData = {
    ...event.toObject(),
    registrationsCount,
  };

  res.status(200).json(new ApiResponse(200, eventData, "Event fetched successfully"));
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

  // coverImage/bannerImage are pasted URLs — use the new one if provided, else keep existing
  const coverImageUrl = rest.coverImage || event.coverImage;
  const bannerImageUrl = rest.bannerImage || event.bannerImage;
  const { coverImage: _ci, bannerImage: _bi, ...restWithoutImages } = rest;

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(finalSlug && { slug: finalSlug }),
      ...restWithoutImages,
      coverImage: coverImageUrl,
      bannerImage: bannerImageUrl,
      // Update legacy fields
      image: coverImageUrl,
      date: rest.startDate || event.startDate,
      content: rest.description || event.description,
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

  // Clean up Cloudinary images
  const coverPublicId = (event as any).coverImagePublicId;
  const bannerPublicId = (event as any).bannerImagePublicId;
  await Promise.all([
    coverPublicId ? deleteFromCloudinary(coverPublicId) : Promise.resolve(),
    bannerPublicId ? deleteFromCloudinary(bannerPublicId) : Promise.resolve(),
  ]);

  // Delete all registrations for this event
  await EventRegistration.deleteMany({ eventId: event._id });
  await event.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Event and its registrations deleted successfully"));
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