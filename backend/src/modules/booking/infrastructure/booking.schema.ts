import { Schema, model, Document, Types } from "mongoose";
import type {
  BookingMode,
  BookingStatus,
  BookingType,
} from "../type/booking.type.js";

export interface IBooking extends Document {
  userId: string;
  facultyId: Types.ObjectId;
  type: BookingType;
  mode: BookingMode;
  slotId?: string[];
  chapterId?: Types.ObjectId;
  isContacted: boolean;
  status: BookingStatus;
  isDeleted: boolean
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: String,
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
      type: [String],
    },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
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
      enum: ["interested", "confirmed", "cancelled"],
      default: "interested",
    },
  },
  {
    timestamps: true,
  },
);

export const BookingModel = model<IBooking>("Booking", bookingSchema);
