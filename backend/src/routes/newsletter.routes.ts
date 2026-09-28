import { Router } from "express";
import { subscribeNewsletter, unsubscribeNewsletter } from "../controllers/newsletterController"

const router=Router();
router.post("/subscribe",subscribeNewsletter);
router.get("/unsubscribe", unsubscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);

export default router;