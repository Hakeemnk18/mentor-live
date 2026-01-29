import { Schema, model, Document } from "mongoose";

export interface IBanner extends Document {
  image: {
    url: string;
    publicId: string;
  };
  description: string;
  priority: number;
  isDeleted: boolean;
}

const bannerSchema = new Schema<IBanner>(
  {
    image: {
      url: {
        type: String,
        required: true,
        trim: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: Number,
      required: true,
      min: 1,
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
bannerSchema.index({ priority: 1 });
bannerSchema.index({ isDeleted: 1 });

export const BannerModel = model<IBanner>("Banner", bannerSchema);
