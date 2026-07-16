import { Router } from "express";
import { getDashboardStats, getAtsStats, getVisitorStats, getNotifications } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth";

const router = Router();

router.use(protect); // All dashboard routes are protected

router.get("/stats", getDashboardStats);
router.get("/ats-stats", getAtsStats);
router.get("/visitor-stats", getVisitorStats);
router.get("/notifications", getNotifications);

export default router;