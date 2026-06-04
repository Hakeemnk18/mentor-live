import z from "zod";
export declare const ConfirmPoolingBookingSchema: z.ZodObject<{
    facultyId: z.ZodString;
    slotId: z.ZodString;
}, z.z.core.$strip>;
export type ConfirmPoolingBookingDto = z.infer<typeof ConfirmPoolingBookingSchema>;
//# sourceMappingURL=confirm.pooling.booking.dto.d.ts.map