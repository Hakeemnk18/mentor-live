import { z } from "zod";
export declare const RemoveUserFromPoolSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    facultyId: z.ZodString;
    userId: z.ZodString;
    mode: z.ZodLiteral<"chapter">;
    chapterId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    facultyId: z.ZodString;
    userId: z.ZodString;
    mode: z.ZodLiteral<"slot">;
    slotId: z.ZodString;
}, z.core.$strip>], "mode">;
export type RemoveUserFromPoolDto = z.infer<typeof RemoveUserFromPoolSchema>;
//# sourceMappingURL=remove.student.from.pooling.dto.d.ts.map