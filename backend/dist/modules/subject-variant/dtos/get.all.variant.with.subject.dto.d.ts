import { z } from "zod";
export declare const GetSubjectVariantsByClassAndSyllabusQuerySchema: z.ZodObject<{
    classId: z.ZodString;
    syllabusId: z.ZodString;
}, z.core.$strip>;
export type GetSubjectVariantsByClassAndSyllabusQueryDto = z.infer<typeof GetSubjectVariantsByClassAndSyllabusQuerySchema>;
//# sourceMappingURL=get.all.variant.with.subject.dto.d.ts.map