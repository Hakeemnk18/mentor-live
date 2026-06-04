import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const GetSubjectVariantsByClassAndSyllabusQuerySchema = z.object({
    classId: ObjectIdSchema,
    syllabusId: ObjectIdSchema,
});
//# sourceMappingURL=get.all.variant.with.subject.dto.js.map