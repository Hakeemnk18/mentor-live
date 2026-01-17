import type z from "zod";
import { BaseAcademicListQuerySchema } from "../../../core/shared/dtos/find.academic.dto.js";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const ChapterListQuerySchema = BaseAcademicListQuerySchema.extend({
  classId: ObjectIdSchema,
  syllabusId: ObjectIdSchema,
});


export type ChapterListQueryDto = z.infer<
  typeof ChapterListQuerySchema
>;