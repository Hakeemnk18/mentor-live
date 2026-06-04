import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const ConfirmChapterPoolingBookingSchema = z.object({
    facultyId: ObjectIdSchema,
    chapterId: ObjectIdSchema,
    slotId: z.array(ObjectIdSchema).min(1),
});
//# sourceMappingURL=confirm.chapter.pooling.dto.js.map