import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const SubjectVariantItemSchema = z.object({
    classId: ObjectIdSchema,
    syllabusId: ObjectIdSchema,
});
export const AddSubjectVariantSchema = z.object({
    variants: z
        .array(SubjectVariantItemSchema)
        .min(1, { message: "At least one variant is required" }),
});
//# sourceMappingURL=add.subject.variant.dto.js.map