import z from "zod";
export declare const SubjectVariantItemSchema: z.ZodObject<{
    classId: z.ZodString;
    syllabusId: z.ZodString;
}, z.z.core.$strip>;
export declare const AddSubjectVariantSchema: z.ZodObject<{
    variants: z.ZodArray<z.ZodObject<{
        classId: z.ZodString;
        syllabusId: z.ZodString;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
export type AddSubjectVariantRequestDto = z.infer<typeof AddSubjectVariantSchema>;
//# sourceMappingURL=add.subject.variant.dto.d.ts.map