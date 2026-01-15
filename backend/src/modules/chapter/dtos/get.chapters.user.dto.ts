import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const GetChaptersForUserQuerySchema = z.object({
  classId: ObjectIdSchema,
  syllabusId: ObjectIdSchema,
  subjectId: ObjectIdSchema.optional(),
  search: z.string().optional().default(""),
  limit: z.coerce.number().default(100),
  sortValue: z.string().optional().default("createdAt"),
});

export type GetChaptersForUserQueryDto = z.infer<
  typeof GetChaptersForUserQuerySchema
>;