import { Schema, model, Document } from "mongoose";
const blogSchema = new Schema({
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    heading: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        url: { type: String, trim: true },
        publicId: { type: String },
    },
    priority: {
        type: Number,
        default: null,
    },
    topic: {
        type: String,
        trim: true,
        default: null,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
/* ---------- Indexes ---------- */
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ isDeleted: 1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({ priority: 1 }, { sparse: true });
blogSchema.index({ isFeatured: 1, priority: 1 });
blogSchema.index({ createdAt: -1 });
export const BlogModel = model("Blog", blogSchema);
//# sourceMappingURL=blog.schema.js.map