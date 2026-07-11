import mongoose, { Schema, Document, Model } from "mongoose";

export type BlogStatus = "Draft" | "Published";

export interface IBlog extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  content: string; // rich text (HTML/Markdown from editor)
  featuredImage: string; // Cloudinary URL
  featuredImagePublicId?: string; // Cloudinary public_id, needed to delete/replace the image
  category: string;
  tags: string[];
  author: string;
  status: BlogStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
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
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image is required"],
    },
    featuredImagePublicId: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Draft", "Published"],
        message: "Status must be either Draft or Published",
      },
      default: "Draft",
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Useful compound index for dashboard counts / listing by status
BlogSchema.index({ status: 1, createdAt: -1 });

const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;