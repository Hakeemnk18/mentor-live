import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import z from "zod";

export const ConfirmChapterOneToOneBookingSchema = z.object({
  bookingId: ObjectIdSchema,
  slotId: z.array(ObjectIdSchema).min(1),
});

export type ConfirmChapterOneToOneBookingDto = z.infer<
  typeof ConfirmChapterOneToOneBookingSchema
>;