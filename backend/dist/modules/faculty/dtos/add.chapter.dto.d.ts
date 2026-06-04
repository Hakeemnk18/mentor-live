import { z } from "zod";
export declare const AddChapterSlotSchema: z.ZodObject<{
    chapterSlots: z.ZodArray<z.ZodObject<{
        chapter: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AddChapterSlotRequestDto = z.infer<typeof AddChapterSlotSchema>;
//# sourceMappingURL=add.chapter.dto.d.ts.map