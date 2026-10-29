import { Router } from "express";
import {
  createCaseStudy,
  getCaseStudies,
  getCaseStudyById,
  updateCaseStudy,
  deleteCaseStudy,
  updateCaseStudyStatus,
  incrementCaseStudyViews,
} from "../controllers/case-study.controller";
import { protect } from "../middlewares/auth";
import { uploadCaseStudyImage } from "../middlewares/upload";

const router = Router();

// ---- Public routes (no authentication required) ----
router.get("/", getCaseStudies);
router.get("/:id", getCaseStudyById);
router.patch("/:id/view", incrementCaseStudyViews);

// ---- Protected routes (admin authentication required) ----
router.use(protect);

router.post("/", uploadCaseStudyImage, createCaseStudy);
router.put("/:id", uploadCaseStudyImage, updateCaseStudy);
router.delete("/:id", deleteCaseStudy);
router.patch("/:id/status", updateCaseStudyStatus);

export default router;

