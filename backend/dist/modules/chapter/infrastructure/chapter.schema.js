import { Schema, model, Document, Types } from "mongoose";
const chapterSchema = new Schema({
    icon: {
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
}, {
    timestamps: true,
});
export const ChapterModel = model("Chapter", chapterSchema);
//# sourceMappingURL=chapter.schema.js.map