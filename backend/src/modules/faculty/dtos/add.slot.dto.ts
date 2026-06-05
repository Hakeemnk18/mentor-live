import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const AddSlotSchema = z
  .object({
    variantId: ObjectIdSchema,

    slots: z
      .array(
        z.object({
          time: z.coerce.date(),
        }),
      )
      .min(1, "At least one slot is required"),
  })
  .superRefine((data, ctx) => {
    const timeSet = new Set<number>();

    data.slots.forEach((slot, i) => {
      const timeValue = slot.time.getTime();

      if (timeSet.has(timeValue)) {
        ctx.addIssue({
          path: ["slots", i, "time"],
          message: "Duplicate slot time is not allowed",
          code: z.ZodIssueCode.custom,
        });
      }
      timeSet.add(timeValue);
    });
  });

export type AddSlotRequestDto = z.infer<typeof AddSlotSchema>;
