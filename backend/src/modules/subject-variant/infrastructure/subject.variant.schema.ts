import { Schema, model, Document, Types } from "mongoose";

export interface ISubjectVariant extends Document {
  subject: Types.ObjectId;
  class: Types.ObjectId;
  syllabus: Types.ObjectId;
  isDeleted: boolean;
}

const subjectVariantSchema = new Schema<ISubjectVariant>(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    syllabus: {
      type: Schema.Types.ObjectId,
      ref: "Syllabus",
      required: true,
      index: true,
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

/**
 * Prevent duplicate combinations:
 * same Subject + Class + Syllabus should not repeat
 */
subjectVariantSchema.index(
  { subject: 1, class: 1, syllabus: 1 },
  { unique: true }
);

export const SubjectVariantModel = model<ISubjectVariant>(
  "SubjectVariant",
  subjectVariantSchema
);
