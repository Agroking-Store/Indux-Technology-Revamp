import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  first_name: string;
  last_name?: string;
  company_name?: string;

  email: string;
  mobile_no: string;
  alternate_mobile_no?: string;

  project_title: string;
  project_description?: string;
  project_budget?: number;
  project_deadline?: Date;

  lead_source?: string;
  industry?: string;

  status:
    | "New"
    | "Contacted"
    | "Qualified"
    | "Proposal Sent"
    | "Negotiation"
    | "Won"
    | "Lost";

  priority: "Low" | "Medium" | "High";

  assigned_to?: mongoose.Types.ObjectId;

  expected_value?: number;

  follow_up_date?: Date;

  notes?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };

  created_by?: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;

  is_deleted: boolean;
}

const LeadSchema = new Schema<ILead>(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },

    last_name: {
      type: String,
      trim: true,
    },

    company_name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    mobile_no: {
      type: String,
      required: true,
      trim: true,
    },

    alternate_mobile_no: {
      type: String,
      trim: true,
    },

    project_title: {
      type: String,
    },

    project_description: {
      type: String,
    },

    project_budget: {
      type: Number,
      default: 0,
    },

    project_deadline: {
      type: Date,
    },

    lead_source: {
      type: String,
      enum: [
        "Website",
        "Referral",
        "LinkedIn",
        "Facebook",
        "Instagram",
        "Google Ads",
        "Walk-in",
        "Email",
        "Other",
      ],
      default: "Website",
    },

    industry: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Negotiation",
        "Won",
        "Lost",
      ],
      default: "New",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    assigned_to: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    expected_value: {
      type: Number,
      default: 0,
    },

    follow_up_date: {
      type: Date,
    },

    notes: {
      type: String,
    },

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILead>("Lead", LeadSchema);