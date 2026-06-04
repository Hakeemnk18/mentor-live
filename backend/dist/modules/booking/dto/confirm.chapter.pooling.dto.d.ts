import z from "zod";
export declare const ConfirmChapterPoolingBookingSchema: z.ZodObject<{
    facultyId: z.ZodString;
    chapterId: z.ZodString;
    slotId: z.ZodArray<z.ZodString>;
}, z.z.core.$strip>;
export type ConfirmChapterPoolingBookingDto = z.infer<typeof ConfirmChapterPoolingBookingSchema>;
//# sourceMappingURL=confirm.chapter.pooling.dto.d.ts.map