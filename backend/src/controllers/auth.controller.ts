import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";
import Admin from "../models/Admin";
import { loginSchema, LoginInput, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";
import { sendEmail } from "../utils/sendEmail";
import { getForgotPasswordEmailTemplate } from "../utils/emailTemplates";

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

// @desc    Forgot Password - Request reset link
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const validated = forgotPasswordSchema.parse(req.body);
  const { email } = validated;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    // Return 200/success to prevent email enumeration, but with a message
    res.status(200).json(new ApiResponse(200, null, "If an account with that email exists, a password reset link has been sent."));
    return;
  }

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash and set resetPasswordToken
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  admin.resetPasswordToken = hashedToken;
  admin.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await admin.save();

  // Create reset url
  const resetUrl = `${env.ADMIN_URL}/reset-password?token=${resetToken}`;

  // Log url for easy testing without SMTP configured
  console.log(`\n🔑 PASSWORD RESET URL FOR TESTING: ${resetUrl}\n`);

  // Send email
  const html = getForgotPasswordEmailTemplate(admin.name, resetUrl);
  try {
    await sendEmail({
      to: admin.email,
      subject: "Password Reset Request",
      html,
    });
  } catch (error) {
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();
    throw ApiError.internal("Email could not be sent");
  }

  res.status(200).json(new ApiResponse(200, null, "Password reset link sent to email"));
});

// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const validated = resetPasswordSchema.parse(req.body);
  const { token, password } = validated;

  // Hash the token from request to match database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find admin with valid token and not expired
  const admin = await Admin.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });

  if (!admin) {
    throw ApiError.badRequest("Invalid or expired password reset token");
  }

  // Update password (pre-save hook will hash it)
  admin.password = password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;

  await admin.save();

  res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});