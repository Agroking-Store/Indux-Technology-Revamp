import { Request, Response } from "express";
import Blog from "../models/Blog";
import { createBlogSchema, updateBlogSchema, updateBlogStatusSchema } from "../validators/blog.validator";
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
// CREATE BLOG
// ============================
export const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Multer stores the file in req.file.buffer when using memoryStorage
  const file = req.file;
  if (!file) {
    throw ApiError.badRequest("Featured image is required");
  }

  // Convert image buffer to Base64 Data URL
  const featuredImage = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  // Parse tags if it's sent as a JSON string (from multipart form-data)
  if (typeof req.body.tags === 'string') {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (e) {
      req.body.tags = [];
    }
  }

  // Clean up empty form fields so they pass Zod validation
  if (req.body.slug === "") delete req.body.slug;
  if (req.body.seoTitle === "") delete req.body.seoTitle;
  if (req.body.seoDescription === "") delete req.body.seoDescription;

  // Validate body (exclude featuredImage as it's from file upload)
  const validatedData = createBlogSchema.parse(req.body);
  const { title, slug, ...rest } = validatedData;

  // Generate slug if not provided
  const finalSlug = slug || generateSlugFromTitle(title);

  // Check if slug already exists
  const existingBlog = await Blog.findOne({ slug: finalSlug });
  if (existingBlog) {
    throw ApiError.conflict("Slug already exists");
  }

  // Create blog
  const blog = await Blog.create({
    title,
    slug: finalSlug,
    ...rest,
    featuredImage,
    // Author can come from logged-in admin
    author: req.admin?.name || "Admin",
  });

  res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

// ============================
// GET ALL BLOGS (with pagination & filtering)
// ============================
export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string; // optional filter

  const filter: any = {};
  if (status && (status === "Draft" || status === "Published")) {
    filter.status = status;
  }

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json(new ApiResponse(200, {
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }, "Blogs fetched successfully"));
});

// ============================
// GET SINGLE BLOG
// ============================
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    throw ApiError.notFound("Blog not found");
  }
  res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

// ============================
// UPDATE BLOG
// ============================
export const updateBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    throw ApiError.notFound("Blog not found");
  }

  // Parse tags if it's sent as a JSON string (from multipart form-data)
  if (typeof req.body.tags === 'string') {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (e) {
      req.body.tags = [];
    }
  }

  // Clean up empty form fields so they pass Zod validation
  if (req.body.slug === "") delete req.body.slug;
  if (req.body.seoTitle === "") delete req.body.seoTitle;
  if (req.body.seoDescription === "") delete req.body.seoDescription;

  // Validate body
  const validatedData = updateBlogSchema.parse(req.body);
  const { title, slug, ...rest } = validatedData;

  // If title is updated, regenerate slug if no custom slug provided
  let finalSlug = slug;
  if (title && !slug) {
    finalSlug = generateSlugFromTitle(title);
  }

  // If slug changed, check uniqueness
  if (finalSlug && finalSlug !== blog.slug) {
    const existing = await Blog.findOne({ slug: finalSlug, _id: { $ne: id } });
    if (existing) {
      throw ApiError.conflict("Slug already exists");
    }
  }

  // Handle featured image upload (if new file uploaded)
  let featuredImage = blog.featuredImage;

  if (req.file) {
    featuredImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  }

  // Update
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(finalSlug && { slug: finalSlug }),
      ...rest,
      featuredImage,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
});

// ============================
// DELETE BLOG
// ============================
export const deleteBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    throw ApiError.notFound("Blog not found");
  }

  // Since we save in MongoDB, we don't need to delete anything from Cloudinary
  await blog.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});

// ============================
// TOGGLE BLOG STATUS
// ============================
export const updateBlogStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const validated = updateBlogStatusSchema.parse(req.body);
  const { status } = validated;

  const blog = await Blog.findById(id);
  if (!blog) {
    throw ApiError.notFound("Blog not found");
  }

  blog.status = status;
  await blog.save();

  res.status(200).json(new ApiResponse(200, blog, `Blog status updated to ${status}`));
});