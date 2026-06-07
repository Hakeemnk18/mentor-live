import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const GetSubjectForUserQuerySchema = z.object({
  syllabusId: ObjectIdSchema.optional(),
  classId: ObjectIdSchema.optional(),
});

export type GetSubjectForUserQueryDto = z.infer<typeof GetSubjectForUserQuerySchema>;
