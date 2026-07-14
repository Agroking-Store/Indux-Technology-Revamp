import { Request, Response } from "express";
import Blog from "../models/Blog";
import Career from "../models/Career";
import Lead from "../models/Lead";
import Event from "../models/Event";
import JobApplication from "../models/JobApplication";
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

// @desc    Get ATS statistics for recruiting
// @route   GET /api/v1/dashboard/ats-stats
// @access  Private
export const getAtsStats = asyncHandler(async (_req: Request, res: Response) => {
  // Counters
  const totalJobs = await Career.countDocuments();
  const activeJobs = await Career.countDocuments({ status: "Active" });
  const totalApplications = await JobApplication.countDocuments();
  const newApplications = await JobApplication.countDocuments({ status: "New" });
  const shortlisted = await JobApplication.countDocuments({ status: "Shortlisted" });
  const interviewsScheduled = await JobApplication.countDocuments({ status: "Interview Scheduled" });
  const hired = await JobApplication.countDocuments({ status: "Hired" });

  // 1. Applications per Job
  const appsPerJobRaw = await JobApplication.aggregate([
    { $group: { _id: "$jobId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const appsPerJob = await Promise.all(
    appsPerJobRaw.map(async (item) => {
      const job = await Career.findById(item._id).select("title");
      return {
        jobTitle: job?.title || "Unknown Position",
        count: item.count,
      };
    })
  );

  // 2. Applications by Location
  const appsByLocation = await JobApplication.aggregate([
    {
      $lookup: {
        from: "careers",
        localField: "jobId",
        foreignField: "_id",
        as: "job"
      }
    },
    { $unwind: "$job" },
    { $group: { _id: "$job.location", count: { $sum: 1 } } },
    { $project: { location: "$_id", count: 1, _id: 0 } },
    { $sort: { count: -1 } }
  ]);

  // 3. Hiring Funnel
  const funnelStages = [
    "New", 
    "Reviewed", 
    "Shortlisted", 
    "Interview Scheduled", 
    "Interview Completed", 
    "Offered", 
    "Hired", 
    "Rejected"
  ];
  const funnelCounts = await Promise.all(
    funnelStages.map(async (stage) => {
      const count = await JobApplication.countDocuments({ status: stage as any });
      return { stage, count };
    })
  );

  // 4. Applications Over Time (Past 6 months trend)
  const past6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    const start = new Date(d);
    
    const end = new Date(d);
    end.setMonth(end.getMonth() + 1);
    end.setMilliseconds(-1);

    const count = await JobApplication.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    const monthLabel = d.toLocaleString("default", { month: "short" });
    past6Months.push({ month: monthLabel, count });
  }

  res.status(200).json(
    new ApiResponse(200, {
      summary: {
        totalJobs,
        activeJobs,
        totalApplications,
        newApplications,
        shortlisted,
        interviewsScheduled,
        hired,
      },
      charts: {
        appsPerJob,
        appsByLocation,
        hiringFunnel: funnelCounts,
        appsOverTime: past6Months,
      }
    }, "ATS statistics fetched successfully")
  );
});