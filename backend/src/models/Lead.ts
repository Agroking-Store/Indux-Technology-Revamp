import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  service?: string;
  message: string;
  status: "New" | "Contacted" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: false },
    service: { type: String, required: false },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILead>("Lead", LeadSchema);
