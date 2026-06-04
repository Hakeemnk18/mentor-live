import { z } from "zod";
export declare const BookingTypeEnum: z.ZodEnum<{
    oneToOne: "oneToOne";
    pooling: "pooling";
}>;
export declare const BookingModeEnum: z.ZodEnum<{
    slot: "slot";
    chapter: "chapter";
}>;
export declare const CreateBookingSchema: z.ZodObject<{
    user: z.ZodObject<{
        name: z.ZodString;
        class: z.ZodString;
        place: z.ZodString;
        phoneNumber: z.ZodString;
        school: z.ZodString;
        syllabus: z.ZodString;
    }, z.core.$strip>;
    booking: z.ZodObject<{
        facultyId: z.ZodString;
        type: z.ZodEnum<{
            oneToOne: "oneToOne";
            pooling: "pooling";
        }>;
        mode: z.ZodEnum<{
            slot: "slot";
            chapter: "chapter";
        }>;
        slotId: z.ZodOptional<z.ZodArray<z.ZodString>>;
        chapterId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateBookingRequestDto = z.infer<typeof CreateBookingSchema>;
//# sourceMappingURL=create.booking.dto.d.ts.map