import mongoose, { Schema, Document } from "mongoose";

export interface ITeamSocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
}

export interface ITeamMember extends Document {
  name: string;
  role: string;
  department?: string;
  image: string;
  bio?: string;
  socialLinks?: ITeamSocialLinks;
  status: "Draft" | "Published";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role/Designation is required"],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: "Leadership",
    },
    image: {
      type: String,
      required: [true, "Team member photo is required"],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    socialLinks: {
      linkedin: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      github: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, default: "" },
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

export default mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
