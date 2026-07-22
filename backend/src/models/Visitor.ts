import mongoose, { Schema, Document } from "mongoose";

export interface IVisitor extends Document {
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const visitorSchema: Schema = new Schema(
  {
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export const Visitor = mongoose.model<IVisitor>("Visitor", visitorSchema);
