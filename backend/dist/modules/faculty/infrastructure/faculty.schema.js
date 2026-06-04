import { Schema, model, Document, Types } from "mongoose";
const facultySchema = new Schema({
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
}, {
    timestamps: true,
});
facultySchema.index({ isDeleted: 1 });
facultySchema.index({ "slots.time": 1 });
facultySchema.index({ "chapterSlots.chapter": 1 });
facultySchema.index({ "subjectOffering.variantId": 1 });
export const FacultyModel = model("Faculty", facultySchema);
//# sourceMappingURL=faculty.schema.js.map