import z from "zod";
export declare const CreateClassSchema: z.ZodObject<{
    name: z.ZodString;
}, z.z.core.$strip>;
export type CreateClassRequestDto = z.infer<typeof CreateClassSchema>;
//# sourceMappingURL=class.create.dto.d.ts.map