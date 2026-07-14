import { Router } from "express";
import {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  updateRegistrationNotes,
  deleteRegistration,
  exportRegistrationsToCSV,
} from "../controllers/event-registration.controller";
import { protect } from "../middlewares/auth";
import { uploadRegistrationFile } from "../middlewares/upload";

const router = Router();

// ---- Public Route ----
router.post("/", uploadRegistrationFile, createRegistration);

// ---- Admin Protected Routes ----
router.use(protect);

router.get("/", getRegistrations);
router.get("/:id", getRegistrationById);
router.patch("/:id/status", updateRegistrationStatus);
router.patch("/:id/notes", updateRegistrationNotes);
router.delete("/:id", deleteRegistration);
router.get("/export/:eventId", exportRegistrationsToCSV);

export default router;
