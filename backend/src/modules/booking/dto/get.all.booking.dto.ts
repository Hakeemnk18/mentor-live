// get.all.booking.dto.ts
import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const BookingTypeEnum = z.enum(["oneToOne", "pooling"]);
export const BookingModeEnum = z.enum(["slot", "chapter"]);
export const BookingStatusEnum = z.enum([
  "interested",
  "confirmed",
  "cancelled",
  "expired",
]);

export const GetAllBookingSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),

  search: z
    .string()
    .optional()
    .transform((val) => val ?? ""),

  type: BookingTypeEnum.optional(),
  mode: BookingModeEnum.optional(),
  status: BookingStatusEnum.optional(),

  isContacted: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),

  syllabusId: ObjectIdSchema.optional(),
  classId: ObjectIdSchema.optional(),
  chapterId: ObjectIdSchema.optional(),
});

export type GetAllBookingDto = z.infer<typeof GetAllBookingSchema>;
