import { Schema, model, Document, Types } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: {
    url: string,
    publicId: string
  };
  price: number;
  subjectOffering: Types.ObjectId[];
  slots: {
    time: Date;
    isAvailable: boolean;
    pool: Types.ObjectId[];
    poolLimit: number;
  }[];
  chapterSlots: {
    chapter: Types.ObjectId;
    isAvailable: boolean;
    pool: Types.ObjectId[];
    poolLimit: number;
  }[];
  isDeleted: boolean;
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

    price: {
      type: Number,
      required: true,
      min: 0,
      
    },

    subjectOffering: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubjectVariant",
        
      },
    ],

    /* ---------- Normal Slots (Embedded) ---------- */
    slots: [
      {
       
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
            ref: "User",
          },
        ],
        poolLimit: {
          type: Number,
          default: 5,
          min: 1,
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
            ref: "User",
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
  },
  {
    timestamps: true,
  }
);


facultySchema.index({ isDeleted: 1 });
facultySchema.index({ "slots.time": 1 });
facultySchema.index({ "chapterSlots.chapter": 1 });

export const FacultyModel = model<IFaculty>("Faculty", facultySchema);
