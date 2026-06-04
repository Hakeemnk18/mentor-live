import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const RemoveUserFromPoolSchema = z.discriminatedUnion("mode", [
    z.object({
        facultyId: ObjectIdSchema,
        userId: ObjectIdSchema,
        mode: z.literal("chapter"),
        chapterId: ObjectIdSchema,
    }),
    z.object({
        facultyId: ObjectIdSchema,
        userId: ObjectIdSchema,
        mode: z.literal("slot"),
        slotId: ObjectIdSchema,
    }),
]);
//# sourceMappingURL=remove.student.from.pooling.dto.js.map