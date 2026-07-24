import { Router } from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogImage,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
} from "../controllers/blog.controller";
import { protect } from "../middlewares/auth";

const router = Router();

// ---- Public routes (no authentication) ----
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.get("/:id/image", getBlogImage);

// ---- Protected routes (admin only) ----
router.use(protect);

router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id/status", updateBlogStatus);

export default router;