import { Request, Response } from "express";
import Lead from "../models/Leads";


export const createLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      data: lead,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllLeads = async ( res: Response) => {
  try {
    const leads = await Lead.find({ is_deleted: false })
      .populate("assigned_to", "first_name last_name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findOne({
      _id: id,
      is_deleted: false,
    }).populate("assigned_to", "first_name last_name email");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    lead.is_deleted = true;
    await lead.save();

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};