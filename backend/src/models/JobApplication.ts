import { Schema, model, Document } from "mongoose";

export interface IJobApplication extends Document {
  careerId: Schema.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter?: string;
  resume: string; // Base64 PDF Data URL
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    careerId: { type: Schema.Types.ObjectId, ref: "Career", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true },
    coverLetter: { type: String },
    resume: { type: String, required: true }, // Base64 PDF Data URL
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default model<IJobApplication>("JobApplication", JobApplicationSchema);