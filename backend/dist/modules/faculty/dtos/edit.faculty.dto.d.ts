import { z } from "zod";
export declare const EditFacultySchema: z.ZodObject<{
    name: z.ZodString;
    qualifications: z.ZodArray<z.ZodString>;
    description: z.ZodString;
    demoClass: z.ZodString;
    image: z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
    }, z.core.$strip>;
    subjects: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        price: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type EditFacultyRequestDto = z.infer<typeof EditFacultySchema>;
//# sourceMappingURL=edit.faculty.dto.d.ts.map