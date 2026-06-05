import { Schema, model, Document, Types } from "mongoose";
import type {
  BookingMode,
  BookingStatus,
  BookingType,
} from "../type/booking.type.js";

export interface IBooking extends Document {
  userId: Types.ObjectId;
  facultyId: Types.ObjectId;
  type: BookingType;
  mode: BookingMode;
  /** For slot-mode: the FacultySlot _id(s) */
  slotId?: Types.ObjectId[];
  /** For slot-mode: which subject variant the student is booking for */
  subjectVariantId?: Types.ObjectId;
  chapterId?: Types.ObjectId;
  isContacted: boolean;
  status: BookingStatus;
  isDeleted: boolean;
  class: Types.ObjectId;
  syllabus: Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    facultyId: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    type: {
      type: String,
      enum: ["oneToOne", "pooling"],
      required: true,
    },

    mode: {
      type: String,
      enum: ["slot", "chapter"],
      required: true,
    },

    slotId: {
      type: [Schema.Types.ObjectId],
      ref: "FacultySlot",
    },

    subjectVariantId: {
      type: Schema.Types.ObjectId,
      ref: "SubjectVariant",
    },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
    },

    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },

    syllabus: {
      type: Schema.Types.ObjectId,
      ref: "Syllabus",
    },

    isContacted: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["interested", "confirmed", "cancelled", "expired"],
      default: "interested",
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ facultyId: 1, status: 1 });
bookingSchema.index({ userId: 1, status: 1 });

export const BookingModel = model<IBooking>("Booking", bookingSchema);
