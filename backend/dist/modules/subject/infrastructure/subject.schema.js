import { Schema, model, Document } from "mongoose";
const subjectSchema = new Schema({
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
}, {
    timestamps: true,
});
export const SubjectModel = model("Subject", subjectSchema);
//# sourceMappingURL=subject.schema.js.map