import mongoose, { Schema, Document } from "mongoose";

export interface IProductFeature {
  title: string;
  desc: string;
}

export interface IProductStat {
  label: string;
  value: string;
}

export interface IProductFaq {
  q: string;
  a: string;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  themeColor: "blue" | "emerald" | "cyan" | "indigo";
  iconName?: string;
  image: string;
  features: IProductFeature[];
  stats: IProductStat[];
  faq: IProductFaq[];
  tech: string[];
  liveUrl?: string;
  status: "Draft" | "Published";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
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
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
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
    themeColor: {
      type: String,
      enum: ["blue", "emerald", "cyan", "indigo"],
      default: "blue",
    },
    iconName: {
      type: String,
      default: "Package",
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    features: [
      {
        title: { type: String, required: true },
        desc: { type: String, required: true },
      },
    ],
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    faq: [
      {
        q: { type: String, required: true },
        a: { type: String, required: true },
      },
    ],
    tech: [
      {
        type: String,
        trim: true,
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

export default mongoose.model<IProduct>("Product", ProductSchema);
