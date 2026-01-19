import { z } from "zod";

export const AddSlotSchema = z
  .object({
   
    slots: z
      .array(
        z.object({
          time: z.coerce.date(),
        }),
      )
      .min(1, "At least one slot is required"),

    
  })
  .superRefine((data, ctx) => {
    /* ---------- prevent duplicate subjects ---------- */
   
    /* ---------- prevent duplicate slot times ---------- */
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

    /* ---------- prevent duplicate chapter slots ---------- */
   
  });

export type AddSlotRequestDto = z.infer<typeof AddSlotSchema>;
