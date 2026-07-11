import express from "express";
import {
  createLead,
  getAllLeads,
  getLeadById,
  deleteLead,
} from "../controllers/leads.controller";

const router = express.Router();

router.post("/create", createLead);
router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.delete("/:id", deleteLead);
router.post("/create", createLead);
export default router;