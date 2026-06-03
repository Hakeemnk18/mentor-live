import { Schema, model, Document } from "mongoose";

export type LeadType = "inquiry" | "request";
export type LeadStatus = "new" | "contacted" | "resolved";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  purpose: string;
  type: LeadType;
  status: LeadStatus;
  classId?: string;
  syllabusId?: string;
  className?: string;
  syllabusName?: string;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    message: {
      type: String,
      trim: true,
      default: null,
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["inquiry", "request"],
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "resolved"],
      default: "new",
    },

    classId: {
      type: String,
      default: null,
    },

    syllabusId: {
      type: String,
      default: null,
    },

    className: {
      type: String,
      default: null,
    },

    syllabusName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/* ---------- Indexes ---------- */
leadSchema.index({ type: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ type: 1, status: 1 });

export const LeadModel = model<ILead>("Lead", leadSchema);
