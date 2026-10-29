import mongoose, { Schema, Document } from "mongoose";

export interface IRecentWorkMetric {
  label: string;
  value: string;
}

export interface IRecentWork extends Document {
  title: string;
  slug: string;
  tagline: string;
  category: string;
  client: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  highlights: string[];
  technologies: string[];
  metrics: IRecentWorkMetric[];
  liveUrl?: string;
  status: "Draft" | "Published";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecentWorkSchema = new Schema<IRecentWork>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
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
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    client: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Project image is required"],
    },
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    metrics: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    liveUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published",
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRecentWork>("RecentWork", RecentWorkSchema);
