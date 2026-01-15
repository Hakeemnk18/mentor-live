import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js"; 

export const AddSubjectVariantSchema = z.object({
  classId: ObjectIdSchema,
  syllabusId: ObjectIdSchema,
});

export type AddSubjectVariantRequestDto = z.infer<
  typeof AddSubjectVariantSchema
>;