import { Schema, model, Document, Types } from "mongoose";

export interface IFacultySlot extends Document {
  facultyId: Types.ObjectId;
  variantId: Types.ObjectId;
  time: Date;
  isAvailable: boolean;
  pool: Types.ObjectId[];
  poolLimit: number;
}

const FacultySlotSchema = new Schema<IFacultySlot>(
  {
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    variantId: {
      type: Schema.Types.ObjectId,
      ref: "SubjectVariant",
      required: true,
    },

    time: {
      type: Date,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    pool: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    poolLimit: {
      type: Number,
      default: 5,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

/* One slot per faculty+variant+time — enforced at DB level */
FacultySlotSchema.index(
  { facultyId: 1, variantId: 1, time: 1 },
  { unique: true },
);

/* Fast cross-disable query: all slots for a faculty at a given time */
FacultySlotSchema.index({ facultyId: 1, time: 1 });

/* Fast fetch: all slots for a faculty+variant */
FacultySlotSchema.index({ facultyId: 1, variantId: 1 });

export const FacultySlotModel = model<IFacultySlot>(
  "FacultySlot",
  FacultySlotSchema,
);
