import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import Admin from "../models/Admin";
import { loginSchema, LoginInput } from "../validators/auth.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";

// Generate JWT token – type assertion to bypass strict typing
const generateToken = (id: string): string => {
  const options: SignOptions = {
    // Cast to any because TypeScript expects a specific union type
    expiresIn: env.JWT_EXPIRES_IN as any,
  };
  return jwt.sign({ id }, env.JWT_SECRET, options);
};

// @desc    Login admin
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  // 🔍 DEBUG: log incoming request body
  console.log('🔍 Incoming body:', req.body);

  const validated = loginSchema.parse(req.body) as LoginInput;
  const { email, password } = validated;

  // 🔍 DEBUG: log extracted email and password
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    console.log('❌ No admin found with email:', email);
    throw ApiError.unauthorized("Invalid credentials");
  }

  // 🔍 DEBUG: log stored hash
  console.log('🔐 Stored hash:', admin.password);

  const isMatch = await admin.comparePassword(password);
  console.log('✅ Password match?', isMatch);

  if (!isMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const token = generateToken(admin._id.toString());

  const adminData = admin.toObject();
  delete (adminData as any).password;

  res.status(200).json(
    new ApiResponse(200, {
      admin: adminData,
      token,
    }, "Login successful")
  );
});

// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// @desc    Get current admin profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(200).json(new ApiResponse(200, req.admin, "Admin profile fetched"));
});