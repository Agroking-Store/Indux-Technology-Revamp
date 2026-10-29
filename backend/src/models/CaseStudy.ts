import mongoose, { Schema, Document, Model } from "mongoose";

export type CaseStudyStatus = "Draft" | "Published";

export interface ICaseStudy extends Document {
  name: string;
  slug: string;
  headline: string;
  challenge: string;
  solution: string;
  result: string;
  image?: string;
  status: CaseStudyStatus;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    headline: {
      type: String,
      required: [true, "Headline is required"],
      trim: true,
    },
    challenge: {
      type: String,
      required: [true, "The challenge is required"],
      trim: true,
    },
    solution: {
      type: String,
      required: [true, "What we built is required"],
      trim: true,
    },
    result: {
      type: String,
      required: [true, "The result is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["Draft", "Published"],
        message: "Status must be either Draft or Published",
      },
      default: "Published",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

CaseStudySchema.index({ status: 1, createdAt: -1 });

const CaseStudy: Model<ICaseStudy> = mongoose.model<ICaseStudy>(
  "CaseStudy",
  CaseStudySchema
);

export default CaseStudy;
