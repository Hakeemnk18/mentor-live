import { Schema, model, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  class: string;
  place: string;
  phoneNumber: string;
  school: string;
  syllabus: string;
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
      type: String,
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
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const StudentModel = model<IStudent>("Student", studentSchema);
