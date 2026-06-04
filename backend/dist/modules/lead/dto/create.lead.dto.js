import { z } from "zod";
export const CreateLeadSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    phone: z
        .string()
        .trim()
        .min(7, "Phone number must be at least 7 digits")
        .max(15, "Phone number must be under 15 digits"),
    email: z.string().trim().email("Invalid email").optional().nullable(),
    message: z.string().trim().max(500).optional().nullable(),
    purpose: z.string().trim().min(1, "Purpose is required").max(200),
    type: z.enum(["inquiry", "request"], {
        message: "Type must be 'inquiry' or 'request'",
    }),
    classId: z.string().optional().nullable(),
    syllabusId: z.string().optional().nullable(),
    className: z.string().trim().optional().nullable(),
    syllabusName: z.string().trim().optional().nullable(),
});
//# sourceMappingURL=create.lead.dto.js.map