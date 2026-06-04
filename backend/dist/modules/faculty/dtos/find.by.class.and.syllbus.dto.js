import { BaseAcademicListQuerySchema } from "../../../core/shared/dtos/find.academic.dto.js";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const GetAllFacultyBYClassAndSyllabusSchema = BaseAcademicListQuerySchema.extend({
    classId: ObjectIdSchema,
    syllabusId: ObjectIdSchema,
});
//# sourceMappingURL=find.by.class.and.syllbus.dto.js.map