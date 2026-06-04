import { Schema, model, Document } from "mongoose";
const bannerSchema = new Schema({
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
    description: {
        type: String,
        required: true,
        trim: true,
    },
    priority: {
        type: Number,
        default: null,
        min: 1,
        max: 5,
    },
    isShow: {
        type: Boolean,
        default: false,
    },
    isClickable: {
        type: Boolean,
        default: false,
    },
    buttonText: {
        type: String,
        trim: true,
        default: "Get In Touch",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
/* ---------- Indexes ---------- */
bannerSchema.index({ priority: 1 });
bannerSchema.index({ isDeleted: 1 });
bannerSchema.index({ isShow: 1 });
bannerSchema.index({ isShow: 1, priority: 1 });
export const BannerModel = model("Banner", bannerSchema);
//# sourceMappingURL=banner.schema.js.map