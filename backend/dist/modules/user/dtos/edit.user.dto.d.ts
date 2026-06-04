import z from "zod";
export declare const EditUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        user: "user";
        admin: "admin";
        salesPerson: "salesPerson";
    }>>;
}, z.z.core.$strip>;
export type EditUserRequestDto = z.infer<typeof EditUserSchema>;
//# sourceMappingURL=edit.user.dto.d.ts.map