import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import ApiError from "../utils/ApiError";
import Admin, { IAdmin } from "../models/Admin";

export interface AuthRequest extends Request {
  admin?: IAdmin;
}

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(ApiError.unauthorized("Not authorized, no token"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return next(ApiError.unauthorized("Admin not found"));
    }
    req.admin = admin;
    next();
  } catch (error) {
    return next(ApiError.unauthorized("Not authorized, token failed"));
  }
};