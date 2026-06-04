import z from "zod";
export declare const BookingTypeEnum: z.ZodEnum<{
    oneToOne: "oneToOne";
    pooling: "pooling";
}>;
export declare const BookingModeEnum: z.ZodEnum<{
    slot: "slot";
    chapter: "chapter";
}>;
export declare const BookingStatusEnum: z.ZodEnum<{
    interested: "interested";
    confirmed: "confirmed";
    cancelled: "cancelled";
    expired: "expired";
}>;
export declare const GetAllBookingSchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string, string | undefined>>;
    type: z.ZodOptional<z.ZodEnum<{
        oneToOne: "oneToOne";
        pooling: "pooling";
    }>>;
    mode: z.ZodOptional<z.ZodEnum<{
        slot: "slot";
        chapter: "chapter";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        interested: "interested";
        confirmed: "confirmed";
        cancelled: "cancelled";
        expired: "expired";
    }>>;
    isContacted: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<boolean | undefined, string | undefined>>;
    syllabusId: z.ZodOptional<z.ZodString>;
    classId: z.ZodOptional<z.ZodString>;
    chapterId: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export type GetAllBookingDto = z.infer<typeof GetAllBookingSchema>;
//# sourceMappingURL=get.all.booking.dto.d.ts.map