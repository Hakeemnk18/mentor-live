import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const GetAllFacultyBYChapterSchema = z.object({
    search: z.string().optional().default(""),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(5),
    sortValue: z.string().optional().default("createdAt"),
    chapterId: ObjectIdSchema
});
//# sourceMappingURL=find.by.chapter.dto.js.map