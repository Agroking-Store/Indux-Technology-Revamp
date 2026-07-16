import Razorpay from "razorpay";
import { env } from "./env";

let razorpay: Razorpay | null = null;

if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay SDK initialized successfully");
} else {
  console.warn("⚠️ Razorpay credentials not found, payments will run in stub mode.");
}

export default razorpay;
