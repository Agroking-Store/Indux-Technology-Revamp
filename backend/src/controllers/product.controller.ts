import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const parseJsonField = (field: any, defaultValue: any) => {
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return defaultValue;
    }
  }
  return field ?? defaultValue;
};

// ============================
// GET ALL PRODUCTS
// ============================
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const status = req.query.status as string;
  const category = req.query.category as string;
  const search = req.query.search as string;

  const filter: any = {};

  if (status && (status === "Draft" || status === "Published")) {
    filter.status = status;
  }
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { shortDescription: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      "Products fetched successfully"
    )
  );
});

// ============================
// GET PRODUCT BY SLUG OR ID
// ============================
export const getProductBySlugOrId = asyncHandler(async (req: Request, res: Response) => {
  const rawId = req.params.identifier;
  const identifier = Array.isArray(rawId) ? rawId[0] : rawId;

  let product = null;
  if (identifier && mongoose.Types.ObjectId.isValid(identifier)) {
    product = await Product.findById(identifier);
  }

  if (!product && identifier) {
    product = await Product.findOne({ slug: identifier });
  }

  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ============================
// CREATE PRODUCT (Admin)
// ============================
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const body = { ...req.body };

  // Parse JSON arrays from multipart/form-data
  body.features = parseJsonField(body.features, []);
  body.stats = parseJsonField(body.stats, []);
  body.faq = parseJsonField(body.faq, []);
  body.tech = parseJsonField(body.tech, []);

  // Image handling
  if (req.file) {
    body.image = `/uploads/products/${req.file.filename}`;
  }

  if (!body.image) {
    throw ApiError.badRequest("Product image is required");
  }

  if (!body.title || !body.category || !body.shortDescription || !body.fullDescription) {
    throw ApiError.badRequest("Title, category, shortDescription, and fullDescription are required");
  }

  const finalSlug = body.slug ? body.slug.toLowerCase().trim() : generateSlugFromTitle(body.title);

  const existing = await Product.findOne({ slug: finalSlug });
  if (existing) {
    throw ApiError.conflict(`Product with slug '${finalSlug}' already exists`);
  }

  body.slug = finalSlug;

  const product = await Product.create(body);

  res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

// ============================
// UPDATE PRODUCT (Admin)
// ============================
export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const body = { ...req.body };

  if (body.features !== undefined) body.features = parseJsonField(body.features, []);
  if (body.stats !== undefined) body.stats = parseJsonField(body.stats, []);
  if (body.faq !== undefined) body.faq = parseJsonField(body.faq, []);
  if (body.tech !== undefined) body.tech = parseJsonField(body.tech, []);

  if (req.file) {
    body.image = `/uploads/products/${req.file.filename}`;
  }

  if (body.slug) {
    body.slug = body.slug.toLowerCase().trim();
    const existing = await Product.findOne({ slug: body.slug, _id: { $ne: id } });
    if (existing) {
      throw ApiError.conflict(`Slug '${body.slug}' is already in use`);
    }
  }

  const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

// ============================
// DELETE PRODUCT (Admin)
// ============================
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});

// ============================
// UPDATE PRODUCT STATUS (Admin)
// ============================
export const updateProductStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== "Draft" && status !== "Published") {
    throw ApiError.badRequest("Status must be either 'Draft' or 'Published'");
  }

  const product = await Product.findByIdAndUpdate(id, { status }, { new: true });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  res.status(200).json(new ApiResponse(200, product, "Product status updated successfully"));
});
