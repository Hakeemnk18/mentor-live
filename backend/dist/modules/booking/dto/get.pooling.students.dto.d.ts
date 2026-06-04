import z from "zod";
export declare const GetAdminPoolingStudentsSchema: z.ZodObject<{
    facultyId: z.ZodString;
    mode: z.ZodEnum<{
        slot: "slot";
        chapter: "chapter";
    }>;
    slotId: z.ZodOptional<z.ZodString>;
    chapterId: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export type GetAdminPoolingStudentsDto = z.infer<typeof GetAdminPoolingStudentsSchema>;
//# sourceMappingURL=get.pooling.students.dto.d.ts.map