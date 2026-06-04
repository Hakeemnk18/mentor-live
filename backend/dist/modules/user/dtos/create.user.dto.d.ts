import z from "zod";
export declare const CreateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{
        user: "user";
        admin: "admin";
        salesPerson: "salesPerson";
    }>;
}, z.z.core.$strip>;
export type CreateUserRequestDto = z.infer<typeof CreateUserSchema>;
//# sourceMappingURL=create.user.dto.d.ts.map