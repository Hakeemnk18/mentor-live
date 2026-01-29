import { Schema, model, Document } from "mongoose";

export interface ITestimonial extends Document {
  author: string;
  designation: string;
  comment: string;
  isDeleted: boolean;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    comment: {
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
testimonialSchema.index({ isDeleted: 1 });
testimonialSchema.index({ author: 1 });

export const TestimonialModel = model<ITestimonial>(
  "Testimonial",
  testimonialSchema
);
