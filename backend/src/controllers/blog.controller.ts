import { Request, Response } from "express";
import mongoose from "mongoose";
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
  // Parse tags if it's sent as a JSON string
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

  // Validate body (featuredImage is a base64 data URI or URL string)
  const validatedData = createBlogSchema.parse(req.body);
  const { title, slug, ...rest } = validatedData;

  // Generate slug if not provided
  const finalSlug = slug || generateSlugFromTitle(title);

  // Check if slug already exists
  const existingBlog = await Blog.findOne({ slug: finalSlug });
  if (existingBlog) {
    throw ApiError.conflict("Slug already exists");
  }

  const blog = await Blog.create({
    title,
    slug: finalSlug,
    ...rest,
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
  
  // Use aggregation pipeline to execute conditional string projection safely based on length
  const blogs = await Blog.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $project: {
        title: 1,
        slug: 1,
        shortDescription: 1,
        category: 1,
        tags: 1,
        author: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        featuredImage: {
          $cond: {
            if: { $gt: [ { $strLenCP: { $ifNull: [ "$featuredImage", "" ] } }, 1000 ] },
            then: "DYNAMIC_IMAGE_ROUTE",
            else: { $ifNull: [ "$featuredImage", "" ] }
          }
        }
      }
    }
  ]);

  const host = req.get("host");
  const protocol = req.protocol;

  const mappedBlogs = blogs.map(blog => {
    const blogObj = { ...blog };
    if (blogObj.featuredImage === "DYNAMIC_IMAGE_ROUTE") {
      blogObj.featuredImage = `${protocol}://${host}/api/v1/blogs/${blog._id}/image`;
    }
    return blogObj;
  });

  res.status(200).json(new ApiResponse(200, {
    blogs: mappedBlogs,
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

  const matchQuery = typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
    ? { _id: new mongoose.Types.ObjectId(id) }
    : { slug: id };

  const result = await Blog.aggregate([
    { $match: matchQuery },
    {
      $project: {
        title: 1,
        slug: 1,
        shortDescription: 1,
        content: 1,
        category: 1,
        tags: 1,
        author: 1,
        status: 1,
        seoTitle: 1,
        seoDescription: 1,
        createdAt: 1,
        updatedAt: 1,
        featuredImage: {
          $cond: {
            if: { $gt: [ { $strLenCP: { $ifNull: [ "$featuredImage", "" ] } }, 1000 ] },
            then: "DYNAMIC_IMAGE_ROUTE",
            else: { $ifNull: [ "$featuredImage", "" ] }
          }
        }
      }
    }
  ]);

  const blog = result[0];

  if (!blog) {
    throw ApiError.notFound("Blog not found");
  }

  const host = req.get("host");
  const protocol = req.protocol;

  const blogObj = { ...blog };
  if (blogObj.featuredImage === "DYNAMIC_IMAGE_ROUTE") {
    blogObj.featuredImage = `${protocol}://${host}/api/v1/blogs/${blogObj._id}/image`;
  }

  res.status(200).json(new ApiResponse(200, blogObj, "Blog fetched successfully"));
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

  // featuredImage is a pasted/base64 string — use the new one if provided, else keep existing
  const featuredImage = rest.featuredImage || blog.featuredImage;
  const { featuredImage: _fi, ...restWithoutImage } = rest;

  // Update
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(finalSlug && { slug: finalSlug }),
      ...restWithoutImage,
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

// ============================
// GET BLOG FEATURED IMAGE
// ============================
export const getBlogImage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`[getBlogImage] Request received for ID/Slug: "${id}"`);

  let blog;
  if (typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)) {
    blog = await Blog.findById(id).select("featuredImage");
  } else {
    blog = await Blog.findOne({ slug: id }).select("featuredImage");
  }

  if (!blog) {
    console.log(`[getBlogImage] Blog not found for ID/Slug: "${id}"`);
    throw ApiError.notFound("Image not found");
  }

  if (!blog.featuredImage) {
    console.log(`[getBlogImage] Blog found, but featuredImage field is empty/null.`);
    throw ApiError.notFound("Image not found");
  }

  console.log(`[getBlogImage] Blog found. featuredImage prefix: "${blog.featuredImage.substring(0, 50)}...", length: ${blog.featuredImage.length}`);

  // Check if it is a base64 data URI (allowing whitespace and newlines)
  const matches = blog.featuredImage.match(/^\s*data:([^;]+);base64,([\s\S]*)$/);
  if (matches && matches.length === 3) {
    const contentType = matches[1];
    const base64Data = matches[2].replace(/\s/g, ""); // Strip all spaces, tabs, and newlines
    const buffer = Buffer.from(base64Data, "base64");
    console.log(`[getBlogImage] Matches base64 format. Content-Type: ${contentType}, binary buffer size: ${buffer.length} bytes`);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable"); // Cache for 1 year
    res.status(200).send(buffer);
    return;
  }

  // Otherwise, it is a regular URL, redirect to it
  console.log(`[getBlogImage] Does not match base64. Redirecting to: "${blog.featuredImage}"`);
  res.redirect(blog.featuredImage);
});