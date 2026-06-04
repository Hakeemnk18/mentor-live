import { Schema, model, Document } from "mongoose";
const phoneVerificationSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
        index: true,
    },
    otpHash: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
        index: true,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    verifiedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});
export const PhoneVerificationModel = model("PhoneVerification", phoneVerificationSchema);
//# sourceMappingURL=phone.verification.schema.js.map