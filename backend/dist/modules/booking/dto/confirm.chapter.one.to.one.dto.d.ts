import z from "zod";
export declare const ConfirmChapterOneToOneBookingSchema: z.ZodObject<{
    bookingId: z.ZodString;
    slotId: z.ZodArray<z.ZodString>;
}, z.z.core.$strip>;
export type ConfirmChapterOneToOneBookingDto = z.infer<typeof ConfirmChapterOneToOneBookingSchema>;
//# sourceMappingURL=confirm.chapter.one.to.one.dto.d.ts.map