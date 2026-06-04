import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import { BookingTypeEnum } from "./create.booking.dto.js";
export const GetChapterBookingDetailsSchema = z.object({
    facultyId: ObjectIdSchema,
    chapterId: ObjectIdSchema,
    bookingType: BookingTypeEnum,
});
//# sourceMappingURL=chapter.booking.details.dto.js.map