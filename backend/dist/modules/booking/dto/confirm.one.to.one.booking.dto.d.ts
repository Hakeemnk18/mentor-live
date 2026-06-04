import z from "zod";
export declare const ConfirmOneToOneBookingSchema: z.ZodObject<{
    bookingId: z.ZodString;
}, z.z.core.$strip>;
export type ConfirmOneToOneBookingDto = z.infer<typeof ConfirmOneToOneBookingSchema>;
//# sourceMappingURL=confirm.one.to.one.booking.dto.d.ts.map