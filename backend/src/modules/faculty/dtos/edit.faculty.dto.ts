import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

const SubjectOfferingSchema = z.object({
  variantId: ObjectIdSchema,
  price: z.number().min(0, { message: "Price must be 0 or greater" }),
});

/** Class times for a subject added during this edit (same shape as create). */
const SubjectSlotSchema = z.object({
  variantId: ObjectIdSchema,
  times: z
    .array(z.object({ time: z.coerce.date() }))
    .min(1, "At least one time slot is required per subject"),
});

export const EditFacultySchema = z
  .object({
    name: z.string().trim().min(2).max(100),

    qualifications: z.array(z.string().trim()).min(1),

    description: z.string().trim().min(10).max(500),

    demoClass: z.string().url(),

    image: z.object({
      url: z.string().trim().min(1, "Icon URL is required"),
      publicId: z.string().trim().min(1, "Icon publicId is required"),
    }),

    isFeatured: z.boolean().optional().default(false),

    subjects: z
      .array(SubjectOfferingSchema)
      .min(1, "At least one subject is required"),

    /**
     * Class times for subjects ADDED in this edit (required for each new subject —
     * enforced in the use case, which knows which subjects are new).
     */
    subjectSlots: z.array(SubjectSlotSchema).optional().default([]),
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

    /* ---------- subjectSlots: must belong to a declared subject, no duplicate times ---------- */
    const slotVariantSet = new Set<string>();
    data.subjectSlots.forEach((group, gi) => {
      if (!variantSet.has(group.variantId)) {
        ctx.addIssue({
          path: ["subjectSlots", gi, "variantId"],
          message: "variantId must match one of the declared subjects",
          code: z.ZodIssueCode.custom,
        });
      }
      if (slotVariantSet.has(group.variantId)) {
        ctx.addIssue({
          path: ["subjectSlots", gi, "variantId"],
          message: "Duplicate subject in subjectSlots",
          code: z.ZodIssueCode.custom,
        });
      }
      slotVariantSet.add(group.variantId);

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
      });
    });
  });

export type EditFacultyRequestDto = z.infer<typeof EditFacultySchema>;
