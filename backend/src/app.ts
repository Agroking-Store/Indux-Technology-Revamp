import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dns from "dns";

import { env } from "./config/env";
import ApiError from "./utils/ApiError";

import authRoutes from "./routes/auth.routes";
import blogRoutes from "./routes/blog.routes";
import careerRoutes from "./routes/career.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import applicationRoutes from "./routes/application.routes";
import leadRoutes from "./routes/lead.routes";
import quoteRoutes from "./routes/quote.routes";
import eventRoutes from "./routes/event.routes";
import eventRegistrationRoutes from "./routes/event-registration.routes";
import visitorRoutes from "./routes/visitor.routes";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app: Application = express();

// Core middleware
app.use(
  cors({
    origin: [env.CLIENT_URL, env.ADMIN_URL],
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Health check route
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// ---- Feature routes will be mounted here in later phases ----
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/careers", careerRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/quotes", quoteRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/event-registrations", eventRegistrationRoutes);
app.use("/api/v1/visitors", visitorRoutes);

// 404 handler (for unmatched routes)
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (recognizes our ApiError, falls back gracefully otherwise)
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (env.NODE_ENV !== "test") {
    console.error(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  return res.status(500).json({ success: false, message });
});

export default app;
