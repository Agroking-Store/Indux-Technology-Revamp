import { Router } from "express";
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/application.controller";
import { uploadResume } from "../middlewares/upload";
import { protect } from "../middlewares/auth";

const router = Router();

// ---- Public endpoint (submit application) ----
router.post("/", uploadResume, submitApplication);

// ---- Protected endpoints (admin only) ----
router.use(protect);

router.get("/", getApplications);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);

export default router;