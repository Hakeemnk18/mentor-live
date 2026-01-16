import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js"; 

export const SubjectVariantItemSchema = z.object({
  classId: ObjectIdSchema,
  syllabusId: ObjectIdSchema,
});

export const AddSubjectVariantSchema = z.object({
  variants: z
    .array(SubjectVariantItemSchema)
    .min(1, { message: "At least one variant is required" }),
});


export type AddSubjectVariantRequestDto = z.infer<
  typeof AddSubjectVariantSchema
>;