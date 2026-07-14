import { Router, Request, Response } from "express";
import { Visitor } from "../models/Visitor";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    let visitor = await Visitor.findOne();

    if (!visitor) {
      visitor = await Visitor.create({ count: 1 });
    } else {
      visitor.count += 1;
      await visitor.save();
    }

    res.status(200).json({
      success: true,
      count: visitor.count,
    });
  }),
);

export default router;
