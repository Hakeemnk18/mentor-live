import { z } from "zod";
export declare const BaseAcademicListQuerySchema: z.ZodObject<{
    classId: z.ZodOptional<z.ZodString>;
    syllabusId: z.ZodOptional<z.ZodString>;
    subjectId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortValue: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=find.academic.dto.d.ts.map