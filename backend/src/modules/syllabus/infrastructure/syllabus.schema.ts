import { Schema, model, Document } from "mongoose";

export interface ISyllabus extends Document {
  name: string;
  isDeleted: boolean;
}

const syllabusSchema = new Schema<ISyllabus>(
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

syllabusSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export const SyllabusModel = model<ISyllabus>("Syllabus", syllabusSchema);
