import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import { BookingModeEnum, BookingTypeEnum } from "./create.booking.dto.js";
export const GetSlotBookingDetailsSchema = z.object({
    facultyId: ObjectIdSchema,
    slotId: ObjectIdSchema,
    bookingType: BookingTypeEnum,
});
//# sourceMappingURL=slot.booking.details.dto.js.map