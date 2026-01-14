import { Schema, model, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  isDeleted: boolean;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true,
      unique: true,
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

export const SubjectModel = model<ISubject>("Subject", subjectSchema);
