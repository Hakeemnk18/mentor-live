import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const MarkBookingContactedSchema = z.object({
  bookingId: ObjectIdSchema,
});

export type MarkBookingContactedDto = z.infer<
  typeof MarkBookingContactedSchema
>;
