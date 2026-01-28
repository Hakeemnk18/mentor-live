import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";


export const ConfirmChapterPoolingBookingSchema = z.object({
  facultyId: ObjectIdSchema,
  chapterId: ObjectIdSchema,
  slotId: z.array(ObjectIdSchema).min(1),

});

export type ConfirmChapterPoolingBookingDto = z.infer<
  typeof ConfirmChapterPoolingBookingSchema
>;