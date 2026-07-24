import mongoose, { Document, Schema } from "mongoose";

export interface INewsletter extends Document {
    email: string;
    status: "Subscribed" | "Unsubscribed";
    subscribedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        status: {
            type: String,
            enum: ["Subscribed", "Unsubscribed"],
            default: "Subscribed",
        },

        subscribedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<INewsletter>(
    "Newsletter",
    NewsletterSchema
);