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
        const ip = req.ip || req.socket.remoteAddress || "unknown";
        
        // Calculate the current date in IST (Indian Standard Time)
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        // 'en-CA' outputs format 'YYYY-MM-DD'
        const visitDateIst = formatter.format(now);

        // Check if this IP has already visited today in IST
        const existingVisit = await Visitor.findOne({ ip, visitDateIst });

        if (!existingVisit) {
          // Create new visitor entry
          await Visitor.create({
            ip,
            userAgent: req.headers["user-agent"],
            visitDateIst,
          });
        }
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
