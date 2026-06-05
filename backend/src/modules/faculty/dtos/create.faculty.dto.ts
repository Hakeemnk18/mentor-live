import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

const SubjectOfferingSchema = z.object({
  variantId: ObjectIdSchema,
  price: z.number().min(0, { message: "Price must be 0 or greater" }),
});

const SubjectSlotSchema = z.object({
  variantId: ObjectIdSchema,
  times: z
    .array(z.object({ time: z.coerce.date() }))
    .min(1, "At least one time slot is required per subject"),
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

    /**
     * Each subject variant gets its own list of time slots.
     * variantId here must match one of the entries in `subjects`.
     */
    subjectSlots: z
      .array(SubjectSlotSchema)
      .min(1, "At least one subject slot group is required"),

    chapterSlots: z
      .array(
        z.object({
          chapter: ObjectIdSchema,
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    /* ── No duplicate variantIds in subjects ── */
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

    /* ── subjectSlots variantIds must exist in subjects ── */
    data.subjectSlots.forEach((group, i) => {
      if (!variantSet.has(group.variantId)) {
        ctx.addIssue({
          path: ["subjectSlots", i, "variantId"],
          message: "variantId must match one of the declared subjects",
          code: z.ZodIssueCode.custom,
        });
      }
    });

    /* ── No duplicate (variantId, time) pairs across subjectSlots ── */
    const slotKey = new Set<string>();
    data.subjectSlots.forEach((group, gi) => {
      const timeSet = new Set<number>();
      group.times.forEach((slot, ti) => {
        const ms = slot.time.getTime();
        if (timeSet.has(ms)) {
          ctx.addIssue({
            path: ["subjectSlots", gi, "times", ti, "time"],
            message: "Duplicate time within the same subject variant",
            code: z.ZodIssueCode.custom,
          });
        }
        timeSet.add(ms);

        const key = `${group.variantId}::${ms}`;
        if (slotKey.has(key)) {
          ctx.addIssue({
            path: ["subjectSlots", gi, "times", ti, "time"],
            message: "Duplicate (variantId, time) pair",
            code: z.ZodIssueCode.custom,
          });
        }
        slotKey.add(key);
      });
    });

    /* ── No duplicate chapter slots ── */
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
