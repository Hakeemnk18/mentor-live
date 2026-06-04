import { Schema, model, Document } from "mongoose";
const syllabusSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});
syllabusSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
export const SyllabusModel = model("Syllabus", syllabusSchema);
//# sourceMappingURL=syllabus.schema.js.map