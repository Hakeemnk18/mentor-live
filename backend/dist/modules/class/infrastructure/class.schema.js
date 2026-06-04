import { Schema, model, Document } from "mongoose";
const classSchema = new Schema({
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
classSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
export const ClassModel = model("Class", classSchema);
//# sourceMappingURL=class.schema.js.map