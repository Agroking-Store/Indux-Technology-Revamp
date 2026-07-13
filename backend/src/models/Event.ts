import mongoose, { Schema, Document, Model } from "mongoose";

export type EventStatus = "Draft" | "Published";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  date: Date;
  location: string;
  image: string; // Base64 or Cloudinary URL
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
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
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["Draft", "Published"],
        message: "Status must be either Draft or Published",
      },
      default: "Draft",
    },
  },
  { timestamps: true }
);

// Index for date-based queries (upcoming vs past) and status
EventSchema.index({ status: 1, date: 1 });

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
