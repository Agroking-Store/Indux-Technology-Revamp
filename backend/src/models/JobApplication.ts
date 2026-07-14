import { Schema, model, Document, Types } from "mongoose";

export interface IJobApplication extends Document {
  jobId: Types.ObjectId | string;
  candidateName: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  noticePeriod?: string;
  expectedCTC?: string;
  answers?: Record<string, any>;
  resume: string; // Base64 PDF Data URL
  status:
    | "New"
    | "Reviewed"
    | "Shortlisted"
    | "Interview Scheduled"
    | "Interview Completed"
    | "Offered"
    | "Hired"
    | "Rejected";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Compatibility virtuals
  careerId: Types.ObjectId | string;
  fullName: string;
  resumeUrl: string;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Career", required: true, index: true },
    candidateName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    coverLetter: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    noticePeriod: { type: String, trim: true },
    expectedCTC: { type: String, trim: true },
    answers: { type: Schema.Types.Mixed, default: {} },
    resume: { type: String, required: true, select: false }, // Don't return massive base64 in default list queries
    status: {
      type: String,
      enum: [
        "New",
        "Reviewed",
        "Shortlisted",
        "Interview Scheduled",
        "Interview Completed",
        "Offered",
        "Hired",
        "Rejected",
      ],
      default: "New",
    },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties for compatibility
JobApplicationSchema.virtual("careerId")
  .get(function (this: IJobApplication) {
    return this.jobId;
  })
  .set(function (this: IJobApplication, val: any) {
    this.jobId = val;
  });

JobApplicationSchema.virtual("fullName")
  .get(function (this: IJobApplication) {
    return this.candidateName;
  })
  .set(function (this: IJobApplication, val: string) {
    this.candidateName = val;
  });

JobApplicationSchema.virtual("resumeUrl").get(function (this: IJobApplication) {
  // Point to our secure local streaming endpoint
  return `/api/v1/applications/${this._id}/resume`;
});

export default model<IJobApplication>("JobApplication", JobApplicationSchema);