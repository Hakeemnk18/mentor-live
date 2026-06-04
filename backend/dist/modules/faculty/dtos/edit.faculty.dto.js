import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
const SubjectOfferingSchema = z.object({
    variantId: ObjectIdSchema,
    price: z.number().min(0, { message: "Price must be 0 or greater" }),
});
export const EditFacultySchema = z
    .object({
    name: z.string().trim().min(2).max(100),
    qualifications: z.array(z.string().trim()).min(1),
    description: z.string().trim().min(10).max(500),
    demoClass: z.string().url(),
    image: z.object({
        url: z.string().trim().min(1, "Icon URL is required"),
        publicId: z.string().trim().min(1, "Icon publicId is required"),
    }),
    subjects: z
        .array(SubjectOfferingSchema)
        .min(1, "At least one subject is required"),
})
    .superRefine((data, ctx) => {
    /* ---------- prevent duplicate variantIds ---------- */
    const variantSet = new Set();
    data.subjects.forEach((item, i) => {
        if (variantSet.has(item.variantId)) {
            ctx.addIssue({
                path: ["subjects", i, "variantId"],
                message: "Duplicate subject variant is not allowed",
                code: z.ZodIssueCode.custom,
            });
        }
        variantSet.add(item.variantId);
    });
});
//# sourceMappingURL=edit.faculty.dto.js.map