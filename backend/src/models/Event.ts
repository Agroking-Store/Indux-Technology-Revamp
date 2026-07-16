import mongoose, { Schema, Document, Model } from "mongoose";

export type EventStatus = "Draft" | "Published";

export interface IFormField {
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date" | "url" | "file";
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface IEvent extends Document {
  title: string;
  slug: string;
  type: string; // Webinar, Hackathon, Workshop, Meetup, Bootcamp, etc.
  category: string;
  coverImage: string;
  bannerImage: string;
  coverImagePublicId?: string; // Cloudinary public_id for deletion
  bannerImagePublicId?: string; // Cloudinary public_id for deletion
  shortDescription: string;
  description: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  organizer: string;
  location: string;
  isPaid: boolean;
  registrationFee: number;
  status: EventStatus;
  formFields: IFormField[];
  speakers?: Array<{ name: string; role: string; company?: string; avatar?: string }>;
  schedule?: Array<{ time: string; title: string; description?: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  createdAt: Date;
  updatedAt: Date;
  // Backward compatibility
  image?: string;
  date?: Date;
  content?: string;
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
    type: {
      type: String,
      required: [true, "Event type is required"],
      default: "Workshop",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "Technology",
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    coverImagePublicId: { type: String }, // Cloudinary public_id
    bannerImage: {
      type: String,
      required: [true, "Banner image is required"],
    },
    bannerImagePublicId: { type: String }, // Cloudinary public_id
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Full description is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      default: "Indux Technology",
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location / venue is required"],
      trim: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["Draft", "Published"],
        message: "Status must be either Draft or Published",
      },
      default: "Draft",
    },
    formFields: [Schema.Types.Mixed],
    speakers: {
      type: [
        {
          name: String,
          role: String,
          company: String,
          avatar: String,
        },
      ],
      default: [],
    },
    schedule: {
      type: [
        {
          time: String,
          title: String,
          description: String,
        },
      ],
      default: [],
    },
    faqs: {
      type: [
        {
          question: String,
          answer: String,
        },
      ],
      default: [],
    },
    // Backward compatibility fields
    image: { type: String },
    date: { type: Date },
    content: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to populate backward-compatible fields automatically
EventSchema.pre("save", function (this: IEvent) {
  if (this.coverImage && !this.image) {
    this.image = this.coverImage;
  }
  if (this.startDate && !this.date) {
    this.date = this.startDate;
  }
  if (this.description && !this.content) {
    this.content = this.description;
  }
});

// Index for date-based queries (upcoming vs past) and status
EventSchema.index({ status: 1, startDate: 1 });

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
