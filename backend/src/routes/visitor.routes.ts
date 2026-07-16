import { Router, Request, Response } from "express";
import { Visitor } from "../models/Visitor";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const shouldLog = req.query.log !== "false";

    if (shouldLog) {
      try {
        // Create new visitor entry
        await Visitor.create({
          ip: req.ip || req.socket.remoteAddress,
          userAgent: req.headers["user-agent"],
        });
      } catch (err) {
        console.error("Failed to log visitor:", err);
      }
    }

    const totalCount = await Visitor.countDocuments();

    res.status(200).json({
      success: true,
      count: totalCount,
    });
  }),
);

export default router;
