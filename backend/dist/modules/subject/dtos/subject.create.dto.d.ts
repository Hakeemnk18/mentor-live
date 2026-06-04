import { z } from "zod";
export declare const CreateSubjectSchema: z.ZodObject<{
    name: z.ZodString;
    syllabusAndClass: z.ZodArray<z.ZodObject<{
        syllabus: z.ZodString;
        classes: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateSubjectRequestDto = z.infer<typeof CreateSubjectSchema>;
//# sourceMappingURL=subject.create.dto.d.ts.map