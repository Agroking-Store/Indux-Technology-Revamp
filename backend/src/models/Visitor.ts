import mongoose, { Schema, Document } from "mongoose";

export interface IVisitor extends Document {
  count: number;
}

const visitorSchema: Schema = new Schema({
  count: { type: Number, default: 0 },
});

export const Visitor = mongoose.model<IVisitor>("Visitor", visitorSchema);
