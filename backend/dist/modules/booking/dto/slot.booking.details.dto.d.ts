import z from "zod";
export declare const GetSlotBookingDetailsSchema: z.ZodObject<{
    facultyId: z.ZodString;
    slotId: z.ZodString;
    bookingType: z.ZodEnum<{
        oneToOne: "oneToOne";
        pooling: "pooling";
    }>;
}, z.z.core.$strip>;
export type GetSlotBookingDetailsDto = z.infer<typeof GetSlotBookingDetailsSchema>;
//# sourceMappingURL=slot.booking.details.dto.d.ts.map