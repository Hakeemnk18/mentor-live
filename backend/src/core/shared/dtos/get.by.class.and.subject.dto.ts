import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import { BaseAcademicListQuerySchema } from "./find.academic.dto.js";

/**
 * Admin list filters. isDeleted: "true" = inactive only, "false" = active only,
 * not sent = all (admins should see every record, active or not).
 */
export const FindByClassSyllabusQuerySchema = BaseAcademicListQuerySchema.extend({
  isDeleted: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === true || val === "true")),
});

export type FindByClassSyllabusQueryDto = z.infer<
  typeof FindByClassSyllabusQuerySchema
>;