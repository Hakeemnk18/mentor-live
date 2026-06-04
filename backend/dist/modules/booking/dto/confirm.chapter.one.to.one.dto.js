import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import z from "zod";
export const ConfirmChapterOneToOneBookingSchema = z.object({
    bookingId: ObjectIdSchema,
    slotId: z.array(ObjectIdSchema).min(1),
});
//# sourceMappingURL=confirm.chapter.one.to.one.dto.js.map