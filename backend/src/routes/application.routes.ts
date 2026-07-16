import { Router } from "express";
import {
  submitApplication,
  getApplications,
  getCandidateDetails,
  getResumeStream,
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
  exportApplications,
} from "../controllers/application.controller";
import { uploadResume } from "../middlewares/upload";
import { protect } from "../middlewares/auth";

const router = Router();

// ---- Public endpoint (submit application) ----
router.post("/", uploadResume, submitApplication);

// ---- Secure resume streaming (supports auth token in query param or auth headers) ----
router.get("/:id/resume", getResumeStream);
router.get("/export", exportApplications);

// ---- Protected endpoints (admin only) ----
router.use(protect);

router.get("/", getApplications);
router.get("/:id", getCandidateDetails);
router.patch("/:id/status", updateApplicationStatus);
router.patch("/:id/notes", updateApplicationNotes);
router.delete("/:id", deleteApplication);

export default router;