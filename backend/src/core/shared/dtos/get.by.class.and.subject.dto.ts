import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import { BaseAcademicListQuerySchema } from "./find.academic.dto.js";

export const FindByClassSyllabusQuerySchema = BaseAcademicListQuerySchema;

export type FindByClassSyllabusQueryDto = z.infer<
  typeof FindByClassSyllabusQuerySchema
>;