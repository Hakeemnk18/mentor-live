import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import { BookingModeEnum } from "./create.booking.dto.js";

export const GetAdminPoolingStudentsSchema = z
  .object({
    facultyId: ObjectIdSchema,
    mode: BookingModeEnum, // "slot" | "chapter"
    slotId: ObjectIdSchema.optional(),
    chapterId: ObjectIdSchema.optional(),
    /**
     * Identifies which pooling round to fetch students for. Sent by the
     * admin "View" button from the row's own poolCycle (see
     * findAllPoolingBooking grouping). Falls back to the slot's/chapter
     * slot's current poolCycle when omitted.
     */
    poolCycle: z.coerce.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "slot") {
      if (!data.slotId) {
        ctx.addIssue({
          path: ["slotId"],
          message: "slotId is required when mode is 'slot'",
          code: z.ZodIssueCode.custom,
        });
      }
      if (data.chapterId) {
        ctx.addIssue({
          path: ["chapterId"],
          message: "chapterId must not be provided when mode is 'slot'",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.mode === "chapter") {
      if (!data.chapterId) {
        ctx.addIssue({
          path: ["chapterId"],
          message: "chapterId is required when mode is 'chapter'",
          code: z.ZodIssueCode.custom,
        });
      }
      if (data.slotId) {
        ctx.addIssue({
          path: ["slotId"],
          message: "slotId must not be provided when mode is 'chapter'",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type GetAdminPoolingStudentsDto = z.infer<
  typeof GetAdminPoolingStudentsSchema
>;