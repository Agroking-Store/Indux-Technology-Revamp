import { Router } from "express";
import {
  getTeamMembers,
  getAdminTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateTeamMemberStatus,
} from "../controllers/team.controller";
import { protect } from "../middlewares/auth";
import { uploadTeamMemberImage } from "../middlewares/upload";

const router = Router();

// ---- Public routes ----
router.get("/", getTeamMembers);
router.get("/:id", getTeamMemberById);

// ---- Protected routes (admin only) ----
router.use(protect);

router.get("/admin/list", getAdminTeamMembers);
router.post("/", uploadTeamMemberImage, createTeamMember);
router.put("/:id", uploadTeamMemberImage, updateTeamMember);
router.delete("/:id", deleteTeamMember);
router.patch("/:id/status", updateTeamMemberStatus);

export default router;
