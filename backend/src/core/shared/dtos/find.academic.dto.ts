import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

const AcademicListBaseFields = {
  classId: ObjectIdSchema.optional(),
  syllabusId: ObjectIdSchema.optional(),
  subjectId: ObjectIdSchema.optional(),
  page: z.coerce.number().default(1),
  search: z.string().optional().default(""),
  limit: z.coerce.number().default(100),
  sortValue: z.string().optional().default("createdAt"),
};

export const BaseAcademicListQuerySchema = z.object(
  AcademicListBaseFields
);