import { Schema, model, Document, Types } from "mongoose";

export interface IChapter extends Document {
  icon: {
    url: string,
    publicId: string
  };
  name: string;
  price: number;
  subjectVariant: Types.ObjectId;
  isDeleted: boolean;
}

const chapterSchema = new Schema<IChapter>(
  {
    icon: {
      url: {
        type: String,
        required: true,
        trim: true,
      },
      publicId: {
        type: String,
        required: false, // important for backward compatibility
      },
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    subjectVariant: {
      type: Schema.Types.ObjectId,
      ref: "SubjectVariant",
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

export const ChapterModel = model<IChapter>("Chapter", chapterSchema);
