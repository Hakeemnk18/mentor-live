import { Schema, model, Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  isDeleted: boolean;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true,
      unique: true   
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

classSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export const ClassModel = model<IClass>("Class", classSchema);