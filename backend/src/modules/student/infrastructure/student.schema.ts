import { Schema, model, Document, Types } from "mongoose";

export interface IStudent extends Document {
  name: string;
  class: Types.ObjectId;
  place: string;
  phoneNumber: string;
  school: string;
  syllabus: Types.ObjectId;
  isDeleted: boolean
}

const studentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      trim: true,
    },

    place: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    school: {
      type: String,
      required: true,
      trim: true,
    },

    syllabus: {
      type: Schema.Types.ObjectId,
      ref: "Syllabus",
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  },
);

export const StudentModel = model<IStudent>("Student", studentSchema);
