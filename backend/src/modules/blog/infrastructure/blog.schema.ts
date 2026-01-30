import { Schema, model, Document } from "mongoose";

export interface IBlog extends Document {
  slug: string;
  author: string;
  heading: string;
  description: string;
  content: string;
  isDeleted: boolean;
}

const blogSchema = new Schema<IBlog>(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    heading: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ---------- Indexes ---------- */
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ isDeleted: 1 });
blogSchema.index({ createdAt: -1 });

export const BlogModel = model<IBlog>("Blog", blogSchema);
