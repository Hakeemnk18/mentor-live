import { Schema, model, Document, Types } from "mongoose";
const bookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    facultyId: {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
    },
    type: {
        type: String,
        enum: ["oneToOne", "pooling"],
        required: true,
    },
    mode: {
        type: String,
        enum: ["slot", "chapter"],
        required: true,
    },
    slotId: {
        type: [String],
    },
    chapterId: {
        type: Schema.Types.ObjectId,
        ref: "Chapter",
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: "Class",
    },
    syllabus: {
        type: Schema.Types.ObjectId,
        ref: "Syllabus",
    },
    isContacted: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["interested", "confirmed", "cancelled", "expired"],
        default: "interested",
    },
}, {
    timestamps: true,
});
export const BookingModel = model("Booking", bookingSchema);
//# sourceMappingURL=booking.schema.js.map