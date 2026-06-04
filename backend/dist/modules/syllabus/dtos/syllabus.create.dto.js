import z from "zod";
export const CreateSyllabusSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: "Syllabus name must be at least 2 characters" })
        .max(100, { message: "Syllabus name must be less than 100 characters" }),
});
//# sourceMappingURL=syllabus.create.dto.js.map