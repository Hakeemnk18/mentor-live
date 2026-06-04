import z from "zod";
export const EditSubjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: "Subject name must be at least 2 characters" })
        .max(100, { message: "Subject name must be less than 100 characters" }),
});
//# sourceMappingURL=edit.subject.dto.js.map