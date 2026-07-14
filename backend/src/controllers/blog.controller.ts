import { Request, Response } from "express";
import Blog from "../models/Blog";
import { createBlogSchema, updateBlogSchema, updateBlogStatusSchema } from "../validators/blog.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary";

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

  // Upload image to Cloudinary (store URL in MongoDB — avoids bloating
  // documents/queries with raw base64 data)
  const upload = await uploadToCloudinary(file.buffer, file.mimetype, "indux/blogs/featured");

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
    // Clean up uploaded image if slug conflicts
    await deleteFromCloudinary(upload.publicId);
    throw ApiError.conflict("Slug already exists");
  }

  // Create blog — store only the Cloudinary URL, not raw base64
  const blog = await Blog.create({
    title,
    slug: finalSlug,
    ...rest,
    featuredImage: upload.url,
    featuredImagePublicId: upload.publicId,
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
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string; // optional filter

  const filter: any = {};
  if (status && (status === "Draft" || status === "Published")) {
    filter.status = status;
  }

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    // Exclude heavy fields not needed for the list view. 'content' is
    // rich HTML (can be 100s of KB). 'featuredImage' is now just a
    // Cloudinary URL (a short string), so it's safe and necessary to
    // include here — the frontend list/card views render it directly.
    .select("-content -seoTitle -seoDescription -featuredImagePublicId")
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

  // Find by ID or by Slug
  let blog;
  if (typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)) {
    blog = await Blog.findById(id);
  } else {
    blog = await Blog.findOne({ slug: id });
  }

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
  let featuredImagePublicId = blog.featuredImagePublicId;

  if (req.file) {
    // Delete old Cloudinary image before uploading the new one
    if (featuredImagePublicId) {
      await deleteFromCloudinary(featuredImagePublicId);
    }
    const upload = await uploadToCloudinary(req.file.buffer, req.file.mimetype, "indux/blogs/featured");
    featuredImage = upload.url;
    featuredImagePublicId = upload.publicId;
  }

  // Update
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(finalSlug && { slug: finalSlug }),
      ...rest,
      featuredImage,
      featuredImagePublicId,
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

  // Clean up the Cloudinary image
  if (blog.featuredImagePublicId) {
    await deleteFromCloudinary(blog.featuredImagePublicId);
  }

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