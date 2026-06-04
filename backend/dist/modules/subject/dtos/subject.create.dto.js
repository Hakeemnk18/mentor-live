import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
export const CreateSubjectSchema = z
    .object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(100),
    syllabusAndClass: z
        .array(z.object({
        syllabus: ObjectIdSchema,
        classes: z
            .array(ObjectIdSchema)
            .min(1, "At least one class is required"),
    }))
        .min(1, "At least one syllabus and class is required"),
})
    .superRefine((data, ctx) => {
    const syllabusIdSet = new Set();
    data.syllabusAndClass.forEach((item, i) => {
        if (syllabusIdSet.has(item.syllabus)) {
            ctx.addIssue({
                path: ["syllabusAndClass", i, "syllabus"],
                message: "Duplicate syllabus is not allowed",
                code: z.ZodIssueCode.custom,
            });
        }
        else {
            syllabusIdSet.add(item.syllabus);
        }
        const classIdSet = new Set();
        item.classes.forEach((cls, j) => {
            if (classIdSet.has(cls)) {
                ctx.addIssue({
                    path: ["syllabusAndClass", i, "classes", j],
                    message: "Duplicate class in the same syllabus is not allowed",
                    code: z.ZodIssueCode.custom,
                });
            }
            else {
                classIdSet.add(cls);
            }
        });
    });
});
//# sourceMappingURL=subject.create.dto.js.map