import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";


export const ConfirmOneToOneBookingSchema = z.object({
  bookingId: ObjectIdSchema,
});

export type ConfirmOneToOneBookingDto = z.infer<
  typeof ConfirmOneToOneBookingSchema
>;