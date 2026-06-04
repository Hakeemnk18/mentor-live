import { Schema, model, Document } from "mongoose";
const testimonialSchema = new Schema({
    author: {
        type: String,
        required: true,
        trim: true,
    },
    designation: {
        type: String,
        required: true,
        trim: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
/* ---------- Indexes ---------- */
testimonialSchema.index({ isDeleted: 1 });
testimonialSchema.index({ author: 1 });
export const TestimonialModel = model("Testimonial", testimonialSchema);
//# sourceMappingURL=testimonial.schema.js.map