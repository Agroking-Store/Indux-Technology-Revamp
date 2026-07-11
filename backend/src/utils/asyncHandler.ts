import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async controller so any thrown/rejected error is forwarded
 * to Express's error-handling middleware via next(err), instead of
 * needing a try/catch block in every controller.
 *
 * Usage:
 *   export const getBlogs = asyncHandler(async (req, res) => { ... });
 */
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;