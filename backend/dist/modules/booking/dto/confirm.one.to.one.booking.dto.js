import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const ConfirmOneToOneBookingSchema = z.object({
    bookingId: ObjectIdSchema,
});
//# sourceMappingURL=confirm.one.to.one.booking.dto.js.map