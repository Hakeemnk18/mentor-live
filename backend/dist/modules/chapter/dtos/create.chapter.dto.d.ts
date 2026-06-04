import { z } from "zod";
export declare const CreateChapterSchema: z.ZodObject<{
    icon: z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
    }, z.core.$strip>;
    name: z.ZodString;
    price: z.ZodNumber;
    subjectVariant: z.ZodString;
}, z.core.$strip>;
export type CreateChapterRequestDto = z.infer<typeof CreateChapterSchema>;
//# sourceMappingURL=create.chapter.dto.d.ts.map