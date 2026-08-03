import { Router } from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  getCategories,
} from "../controllers/blog.controller";
import { protect } from "../middlewares/auth";
import { uploadBlogImage } from "../middlewares/upload";

const router = Router();

// ---- Public routes (no authentication) ----
router.get("/", getBlogs);
router.get("/categories", getCategories);
router.get("/:id", getBlogById);

// ---- Protected routes (admin only) ----
router.use(protect);

router.post("/", uploadBlogImage, createBlog);
router.put("/:id", uploadBlogImage, updateBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id/status", updateBlogStatus);

export default router;