import { BaseAcademicListQuerySchema } from "../../../core/shared/dtos/find.academic.dto.js";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const ChapterListQuerySchema = BaseAcademicListQuerySchema.extend({
    classId: ObjectIdSchema,
    syllabusId: ObjectIdSchema,
});
//# sourceMappingURL=get.chapter.dto.js.map