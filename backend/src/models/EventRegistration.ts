import mongoose, { Schema, Document, Model } from "mongoose";

export type RegistrationStatus = "Pending" | "Approved" | "Rejected" | "Attended";

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  answers: Record<string, any>; // Stores dynamic form fields answers
  status: RegistrationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    answers: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Approved", "Rejected", "Attended"],
        message: "Status must be Pending, Approved, Rejected, or Attended",
      },
      default: "Pending",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations for the same event with same email
EventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

const EventRegistration: Model<IEventRegistration> = mongoose.model<IEventRegistration>(
  "EventRegistration",
  EventRegistrationSchema
);

export default EventRegistration;
