import z from "zod";
export const CreateClassSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: "Class name must be at least 2 characters" })
        .max(100, { message: "Class name must be less than 100 characters" }),
});
//# sourceMappingURL=class.create.dto.js.map