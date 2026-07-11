import mongoose, { Schema, Document, Model } from "mongoose";

export type EmploymentType = "Full Time" | "Internship";
export type CareerStatus = "Active" | "Closed";

export interface ICareer extends Document {
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  experience: string;
  openings: number;
  description: string; // rich text
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  salary?: string;
  status: CareerStatus;
  lastDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: {
        values: ["Full Time", "Internship"],
        message: "Employment type must be Full Time or Internship",
      },
      required: [true, "Employment type is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
      trim: true,
    },
    openings: {
      type: Number,
      required: [true, "Number of openings is required"],
      min: [1, "Openings must be at least 1"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Closed"],
        message: "Status must be Active or Closed",
      },
      default: "Active",
    },
    lastDate: {
      type: Date,
      required: [true, "Last date to apply is required"],
    },
  },
  { timestamps: true }
);

// Useful compound index for dashboard counts / listing by status
CareerSchema.index({ status: 1, createdAt: -1 });

const Career: Model<ICareer> = mongoose.model<ICareer>("Career", CareerSchema);

export default Career;