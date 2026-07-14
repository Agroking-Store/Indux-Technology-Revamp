import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,
} from "../controllers/event.controller";
import { protect } from "../middlewares/auth";

const router = Router();

// ---- Public routes (no authentication) ----
router.get("/", getEvents);
router.get("/:id", getEventById);

// ---- Protected routes (admin only) ----
router.use(protect);

router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.patch("/:id/status", updateEventStatus);

export default router;