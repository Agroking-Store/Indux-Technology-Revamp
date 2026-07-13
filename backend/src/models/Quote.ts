import mongoose, { Schema, Document } from "mongoose";

export interface IQuote extends Document {
  name: string;
  companyName?: string;
  workEmail: string;
  phone: string;
  serviceInterest: string;
  message?: string;
  status: "New" | "Contacted" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String, required: false },
    workEmail: { type: String, required: true },
    phone: { type: String, required: true },
    serviceInterest: { type: String, required: true },
    message: { type: String, required: false },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuote>("Quote", QuoteSchema);
