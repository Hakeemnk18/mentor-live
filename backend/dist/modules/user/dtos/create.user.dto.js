import z from "zod";
export const CreateUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(100, { message: "Name must be less than 100 characters" }),
    email: z
        .string()
        .trim()
        .email({ message: "Invalid email address" })
        .min(1, { message: "Email cannot be empty" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password must be less than 50 characters" }),
    role: z.enum(["user", "admin", "salesPerson"], {
        message: "Role must be user, admin, or salesPerson",
    }),
});
//# sourceMappingURL=create.user.dto.js.map