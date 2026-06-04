import { Schema, model, Document, Types } from "mongoose";
const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
        trim: true,
    },
    place: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    school: {
        type: String,
        required: true,
        trim: true,
    },
    syllabus: {
        type: Schema.Types.ObjectId,
        ref: "Syllabus",
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
export const StudentModel = model("Student", studentSchema);
//# sourceMappingURL=student.schema.js.map