import { Router } from "express";
import { getDashboardStats, getAtsStats } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth";

const router = Router();

router.use(protect); // All dashboard routes are protected

router.get("/stats", getDashboardStats);
router.get("/ats-stats", getAtsStats);

export default router;