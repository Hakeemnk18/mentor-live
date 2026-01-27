import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";


export const ConfirmPoolingBookingSchema = z.object({
  bookingIds: z.array(ObjectIdSchema).min(1),
});

export type ConfirmPoolingBookingDto = z.infer<
  typeof ConfirmPoolingBookingSchema
>;