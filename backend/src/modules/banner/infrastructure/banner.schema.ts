import { Schema, model, Document } from "mongoose";

export interface IBanner extends Document {
  image: {
    url: string;
    publicId: string;
  };
  /** Square image for phones (null for banners created before it existed). */
  mobileImage?: {
    url: string;
    publicId: string;
  } | null;
  description: string;
  priority: number | null;
  isShow: boolean;
  isClickable: boolean;
  buttonText: string;
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

    mobileImage: {
      type: new Schema(
        {
          url: { type: String, required: true, trim: true },
          publicId: { type: String, required: true },
        },
        { _id: false },
      ),
      default: null,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: Number,
      default: null,
      min: 1,
      max: 5,
    },

    isShow: {
      type: Boolean,
      default: false,
    },

    isClickable: {
      type: Boolean,
      default: false,
    },

    buttonText: {
      type: String,
      trim: true,
      default: "Get In Touch",
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
bannerSchema.index({ isShow: 1 });
bannerSchema.index({ isShow: 1, priority: 1 });

export const BannerModel = model<IBanner>("Banner", bannerSchema);
