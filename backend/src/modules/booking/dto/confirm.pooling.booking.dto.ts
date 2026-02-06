import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";


export const ConfirmPoolingBookingSchema = z.object({
  facultyId: ObjectIdSchema,
  slotId: ObjectIdSchema

});

export type ConfirmPoolingBookingDto = z.infer<
  typeof ConfirmPoolingBookingSchema
>;