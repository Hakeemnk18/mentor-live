import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

const SubjectOfferingSchema = z.object({
  variantId: ObjectIdSchema,
  price: z.number().min(0, { message: "Price must be 0 or greater" }),
});

export const CreateFacultySchema = z
  .object({
    name: z.string().trim().min(2).max(100),

    qualifications: z.array(z.string().trim()).min(1),

    description: z.string().trim().min(10).max(500),

    demoClass: z.string().url(),

    image: z.object({
      url: z.string().trim().min(1, "Icon URL is required"),
      publicId: z.string().trim().min(1, "Icon publicId is required"),
    }),

    subjects: z
      .array(SubjectOfferingSchema)
      .min(1, "At least one subject is required"),

    slots: z
      .array(
        z.object({
          time: z.coerce.date(),
        }),
      )
      .min(1, "At least one slot is required"),

    chapterSlots: z
      .array(
        z.object({
          chapter: ObjectIdSchema,
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    /* ---------- prevent duplicate variantIds ---------- */
    const variantSet = new Set<string>();

    data.subjects.forEach((item, i) => {
      if (variantSet.has(item.variantId)) {
        ctx.addIssue({
          path: ["subjects", i, "variantId"],
          message: "Duplicate subject variant is not allowed",
          code: z.ZodIssueCode.custom,
        });
      }
      variantSet.add(item.variantId);
    });

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
    if (data.chapterSlots) {
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
    }
  });

export type CreateFacultyRequestDto = z.infer<typeof CreateFacultySchema>;
