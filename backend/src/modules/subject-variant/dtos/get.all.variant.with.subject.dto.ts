import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const GetSubjectVariantsByClassAndSyllabusQuerySchema = z.object({
  classId: ObjectIdSchema,
  syllabusId: ObjectIdSchema,
});

export type GetSubjectVariantsByClassAndSyllabusQueryDto = z.infer<
  typeof GetSubjectVariantsByClassAndSyllabusQuerySchema
>;