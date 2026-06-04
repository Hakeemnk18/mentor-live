import { Schema, model, Document } from "mongoose";
const leadSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
    },
    message: {
        type: String,
        trim: true,
        default: null,
    },
    purpose: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["inquiry", "request"],
        required: true,
    },
    status: {
        type: String,
        enum: ["new", "contacted", "resolved"],
        default: "new",
    },
    classId: {
        type: String,
        default: null,
    },
    syllabusId: {
        type: String,
        default: null,
    },
    className: {
        type: String,
        default: null,
    },
    syllabusName: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
/* ---------- Indexes ---------- */
leadSchema.index({ type: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ type: 1, status: 1 });
export const LeadModel = model("Lead", leadSchema);
//# sourceMappingURL=lead.schema.js.map