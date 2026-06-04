import z from "zod";
export declare const GetChapterBookingDetailsSchema: z.ZodObject<{
    facultyId: z.ZodString;
    chapterId: z.ZodString;
    bookingType: z.ZodEnum<{
        oneToOne: "oneToOne";
        pooling: "pooling";
    }>;
}, z.z.core.$strip>;
export type GetChapterBookingDetailsDto = z.infer<typeof GetChapterBookingDetailsSchema>;
//# sourceMappingURL=chapter.booking.details.dto.d.ts.map