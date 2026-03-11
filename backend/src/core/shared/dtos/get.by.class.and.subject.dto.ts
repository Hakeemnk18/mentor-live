import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import { BaseAcademicListQuerySchema } from "./find.academic.dto.js";

export const FindByClassSyllabusQuerySchema = BaseAcademicListQuerySchema.extend({
  isDeleted: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((val) => val === true || val === "true")
    .default(false),
});

export type FindByClassSyllabusQueryDto = z.infer<
  typeof FindByClassSyllabusQuerySchema
>;