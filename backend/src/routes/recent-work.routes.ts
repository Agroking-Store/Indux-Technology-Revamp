import { Router } from "express";
import {
  createRecentWork,
  getRecentWorks,
  getRecentWorkBySlugOrId,
  updateRecentWork,
  deleteRecentWork,
  updateRecentWorkStatus,
} from "../controllers/recentWork.controller";
import { protect } from "../middlewares/auth";
import { uploadRecentWorkImage } from "../middlewares/upload";

const router = Router();

// ---- Public routes ----
router.get("/", getRecentWorks);
router.get("/:identifier", getRecentWorkBySlugOrId);

// ---- Protected routes (admin only) ----
router.use(protect);

router.post("/", uploadRecentWorkImage, createRecentWork);
router.put("/:id", uploadRecentWorkImage, updateRecentWork);
router.delete("/:id", deleteRecentWork);
router.patch("/:id/status", updateRecentWorkStatus);

export default router;
