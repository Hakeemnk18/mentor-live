import { Schema, model, Document, Types } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: {
    url: string;
    publicId: string;
  };
  subjectOffering: {
    variantId: Types.ObjectId;
    price: number;
  }[];
  chapterSlots: {
    chapter: Types.ObjectId;
    isAvailable: boolean;
    pool: Types.ObjectId[];
    poolLimit: number;
  }[];
  isDeleted: boolean;
  isFeatured: boolean;
}

const facultySchema = new Schema<IFaculty>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    qualifications: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    demoClass: {
      type: String,
      required: true,
    },

    image: {
      url: {
        type: String,
        required: true,
        trim: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    subjectOffering: [
      {
        variantId: {
          type: Schema.Types.ObjectId,
          ref: "SubjectVariant",
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    /* ---------- Chapter Slots (Embedded) ---------- */
    chapterSlots: [
      {
        chapter: {
          type: Schema.Types.ObjectId,
          ref: "Chapter",
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
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

facultySchema.index({ isDeleted: 1 });
facultySchema.index({ "chapterSlots.chapter": 1 });
facultySchema.index({ "subjectOffering.variantId": 1 });

export const FacultyModel = model<IFaculty>("Faculty", facultySchema);
