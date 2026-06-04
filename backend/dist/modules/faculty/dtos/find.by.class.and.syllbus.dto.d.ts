import type z from "zod";
export declare const GetAllFacultyBYClassAndSyllabusSchema: z.ZodObject<{
    subjectId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.z.ZodCoercedNumber<unknown>>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    limit: z.ZodDefault<z.z.ZodCoercedNumber<unknown>>;
    sortValue: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    classId: z.ZodString;
    syllabusId: z.ZodString;
}, z.z.core.$strip>;
export type GetAllFacultyBYClassAndSyllabusDto = z.infer<typeof GetAllFacultyBYClassAndSyllabusSchema>;
//# sourceMappingURL=find.by.class.and.syllbus.dto.d.ts.map