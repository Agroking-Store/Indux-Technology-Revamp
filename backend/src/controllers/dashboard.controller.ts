import { Request, Response } from "express";
import Blog from "../models/Blog";
import Career from "../models/Career";
import Lead from "../models/Lead";
import Event from "../models/Event";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  // Blog counts
  const totalBlogs = await Blog.countDocuments();
  const publishedBlogs = await Blog.countDocuments({ status: "Published" });
  const draftBlogs = await Blog.countDocuments({ status: "Draft" });

  // Career counts
  const totalJobs = await Career.countDocuments();
  const activeJobs = await Career.countDocuments({ status: "Active" });
  const closedJobs = await Career.countDocuments({ status: "Closed" });

  // Lead counts
  const totalLeads = await Lead.countDocuments();
  const newLeads = await Lead.countDocuments({ status: "New" });
  const contactedLeads = await Lead.countDocuments({ status: "Contacted" });

  // Event counts
  const totalEvents = await Event.countDocuments();
  const upcomingEvents = await Event.countDocuments({ status: "Published", date: { $gte: new Date() } });

  res.status(200).json(
    new ApiResponse(200, {
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
      },
      careers: {
        total: totalJobs,
        active: activeJobs,
        closed: closedJobs,
      },
      leads: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
      },
      // optional: quick actions (frontend uses these as links)
      quickActions: {
        addBlog: "/blogs/create",
        addJob: "/careers/create",
        addEvent: "/events/create",
      },
    }, "Dashboard statistics fetched successfully")
  );
});