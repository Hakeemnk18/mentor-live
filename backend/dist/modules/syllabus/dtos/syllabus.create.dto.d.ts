import z from "zod";
export declare const CreateSyllabusSchema: z.ZodObject<{
    name: z.ZodString;
}, z.z.core.$strip>;
export type CreateSyllabusRequestDto = z.infer<typeof CreateSyllabusSchema>;
//# sourceMappingURL=syllabus.create.dto.d.ts.map