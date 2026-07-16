import { Router } from "express";
import { login, logout, getMe, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;