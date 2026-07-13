import { Router } from "express";
import { protect } from "../middlewares/auth";
import {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
} from "../controllers/lead.controller";

const router = Router();

// Public route to submit lead
router.post("/", createLead);

// Protected admin routes to view & manage leads
router.get("/", protect, getLeads);
router.patch("/:id/status", protect, updateLeadStatus);
router.delete("/:id", protect, deleteLead);

export default router;
