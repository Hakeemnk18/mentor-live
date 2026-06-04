import { z } from "zod";
export declare const CreateLeadSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    message: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    purpose: z.ZodString;
    type: z.ZodEnum<{
        inquiry: "inquiry";
        request: "request";
    }>;
    classId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    syllabusId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    className: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    syllabusName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateLeadRequestDto = z.infer<typeof CreateLeadSchema>;
//# sourceMappingURL=create.lead.dto.d.ts.map