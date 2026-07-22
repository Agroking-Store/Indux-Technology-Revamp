import { Router } from "express";
import {
  createCareer,
  getCareers,
  getCareerById,
  updateCareer,
  deleteCareer,
  updateCareerStatus,
  duplicateCareer,
} from "../controllers/career.controller";
import { protect } from "../middlewares/auth";

const router = Router();

// ---- Public routes (no authentication) ----
router.get("/", getCareers);
router.get("/:id", getCareerById);

// ---- Protected routes (admin only) ----
router.use(protect); // all routes below this require authentication

router.post("/", createCareer);
router.post("/:id/duplicate", duplicateCareer);
router.put("/:id", updateCareer);
router.delete("/:id", deleteCareer);
router.patch("/:id/status", updateCareerStatus);

export default router;