import z from "zod";
export declare const GetAllBookingByOneToOneSchema: z.ZodObject<{
    classId: z.ZodOptional<z.ZodString>;
    syllabusId: z.ZodOptional<z.ZodString>;
    subjectId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.z.ZodCoercedNumber<unknown>>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    limit: z.ZodDefault<z.z.ZodCoercedNumber<unknown>>;
    sortValue: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isContacted: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
    status: z.ZodOptional<z.ZodEnum<{
        interested: "interested";
        confirmed: "confirmed";
        cancelled: "cancelled";
        expired: "expired";
    }>>;
    chapterId: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        slot: "slot";
        chapter: "chapter";
    }>>;
}, z.z.core.$strip>;
export type GetAllOneToOneBookingDto = z.infer<typeof GetAllBookingByOneToOneSchema>;
//# sourceMappingURL=get.all.one.to.one.dto.d.ts.map