import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

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

    price: z.number().min(0),

    subjects: z
      .array(ObjectIdSchema)
      .min(1, "At least one subject is required"),
  })
  .superRefine((data, ctx) => {
    /* ---------- prevent duplicate subjects ---------- */
    const subjectSet = new Set<string>();

    data.subjects.forEach((id, i) => {
      if (subjectSet.has(id)) {
        ctx.addIssue({
          path: ["subjects", i],
          message: "Duplicate subject is not allowed",
          code: z.ZodIssueCode.custom,
        });
      }
      subjectSet.add(id);
    });
  });

export type EditFacultyRequestDto = z.infer<typeof EditFacultySchema>;
