import { z } from "zod";
export declare const FindByClassSyllabusQuerySchema: z.ZodObject<{
    classId: z.ZodOptional<z.ZodString>;
    syllabusId: z.ZodOptional<z.ZodString>;
    subjectId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortValue: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isDeleted: z.ZodDefault<z.ZodPipe<z.ZodUnion<readonly [z.ZodBoolean, z.ZodEnum<{
        true: "true";
        false: "false";
    }>]>, z.ZodTransform<boolean, boolean | "true" | "false">>>;
}, z.core.$strip>;
export type FindByClassSyllabusQueryDto = z.infer<typeof FindByClassSyllabusQuerySchema>;
//# sourceMappingURL=get.by.class.and.subject.dto.d.ts.map