import z from "zod";
import { BaseAcademicListQuerySchema } from "../../../core/shared/dtos/find.academic.dto.js";
import { BookingStatusEnum } from "./booking.status.dto.js";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import { BookingModeEnum } from "./create.booking.dto.js";

export const GetAllBookingByOneToOneSchema = BaseAcademicListQuerySchema.extend(
  {
    isContacted: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),
    status: BookingStatusEnum.optional(),
    chapterId: ObjectIdSchema.optional(),
    mode: BookingModeEnum.optional(),
  },
);

export type GetAllOneToOneBookingDto = z.infer<
  typeof GetAllBookingByOneToOneSchema
>;
