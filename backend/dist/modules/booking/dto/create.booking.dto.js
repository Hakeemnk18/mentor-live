import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
/* enums */
export const BookingTypeEnum = z.enum(["oneToOne", "pooling"]);
export const BookingModeEnum = z.enum(["slot", "chapter"]);
/* schema */
export const CreateBookingSchema = z
    .object({
    user: z.object({
        name: z.string().trim().min(2).max(100),
        class: ObjectIdSchema,
        place: z.string().trim().min(1),
        phoneNumber: z.string().trim().min(7).max(15),
        school: z.string().trim().min(1),
        syllabus: ObjectIdSchema,
    }),
    booking: z.object({
        facultyId: ObjectIdSchema,
        type: BookingTypeEnum,
        mode: BookingModeEnum,
        slotId: z.array(ObjectIdSchema).optional(),
        chapterId: ObjectIdSchema.optional(),
    }),
})
    .superRefine((data, ctx) => {
    const { mode, slotId, chapterId } = data.booking;
    /* mode = slot → slotId required */
    if (mode === "slot") {
        if (!slotId || slotId.length === 0) {
            ctx.addIssue({
                path: ["booking", "slotId"],
                message: "slotId is required when mode is slot",
                code: z.ZodIssueCode.custom,
            });
        }
        if (chapterId) {
            ctx.addIssue({
                path: ["booking", "chapterId"],
                message: "chapterId is not allowed when mode is slot",
                code: z.ZodIssueCode.custom,
            });
        }
    }
    /* mode = chapter → chapterId required */
    if (mode === "chapter") {
        if (!chapterId) {
            ctx.addIssue({
                path: ["booking", "chapterId"],
                message: "chapterId is required when mode is chapter",
                code: z.ZodIssueCode.custom,
            });
        }
        if (slotId && slotId.length > 0) {
            ctx.addIssue({
                path: ["booking", "slotId"],
                message: "slotId is not allowed when mode is chapter",
                code: z.ZodIssueCode.custom,
            });
        }
    }
});
//# sourceMappingURL=create.booking.dto.js.map