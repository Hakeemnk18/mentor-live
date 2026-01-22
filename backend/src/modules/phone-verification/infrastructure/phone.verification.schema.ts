import { Schema, model, Document } from "mongoose";

export interface IPhoneVerification extends Document {
  phoneNumber: string;
  isVerified: boolean;
  otpHash?: string;
  otpExpiresAt?: Date;
  attempts: number;
  verifiedAt?: Date;
  isDeleted: boolean;
}

const phoneVerificationSchema = new Schema<IPhoneVerification>(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    otpHash: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    verifiedAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);





export const PhoneVerificationModel = model<IPhoneVerification>(
  "PhoneVerification",
  phoneVerificationSchema
);
