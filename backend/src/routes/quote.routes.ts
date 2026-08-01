import { Router } from "express";
import { protect } from "../middlewares/auth";
import {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuoteStatus,
  deleteQuote,
} from "../controllers/quote.controller";

const router = Router();

// Public route to submit quote
router.post("/", createQuote);

// Protected admin routes to view & manage quotes
router.get("/", protect, getQuotes);
router.get("/:id", protect, getQuoteById);
router.patch("/:id/status", protect, updateQuoteStatus);
router.delete("/:id", protect, deleteQuote);

export default router;
