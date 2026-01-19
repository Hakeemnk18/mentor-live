import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const AddChapterSlotSchema = z
  .object({
    chapterSlots: z.array(
      z.object({
        chapter: ObjectIdSchema,
      }),
    ).min(1,"one chapter slot required")
  })
  
  .superRefine((data, ctx) => {
    /* ---------- prevent duplicate chapter slots ---------- */

    const chapterSet = new Set<string>();

    data.chapterSlots.forEach((slot, i) => {
      if (chapterSet.has(slot.chapter)) {
        ctx.addIssue({
          path: ["chapterSlots", i, "chapter"],
          message: "Duplicate chapter slot is not allowed",
          code: z.ZodIssueCode.custom,
        });
      }
      chapterSet.add(slot.chapter);
    });
  });

export type AddChapterSlotRequestDto = z.infer<typeof AddChapterSlotSchema>;
