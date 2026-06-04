import { z } from "zod";
export declare const GetAllFacultyBYChapterSchema: z.ZodObject<{
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortValue: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    chapterId: z.ZodString;
}, z.core.$strip>;
export type GetAllFacultyBYChapterDto = z.infer<typeof GetAllFacultyBYChapterSchema>;
//# sourceMappingURL=find.by.chapter.dto.d.ts.map