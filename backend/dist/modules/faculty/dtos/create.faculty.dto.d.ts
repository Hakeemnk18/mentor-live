import { z } from "zod";
export declare const CreateFacultySchema: z.ZodObject<{
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
    slots: z.ZodArray<z.ZodObject<{
        time: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>;
    chapterSlots: z.ZodOptional<z.ZodArray<z.ZodObject<{
        chapter: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateFacultyRequestDto = z.infer<typeof CreateFacultySchema>;
//# sourceMappingURL=create.faculty.dto.d.ts.map