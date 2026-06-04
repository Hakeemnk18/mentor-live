import { z } from "zod";
export declare const CreateTestimonialSchema: z.ZodObject<{
    author: z.ZodString;
    designation: z.ZodString;
    comment: z.ZodString;
}, z.core.$strip>;
export type CreateTestimonialRequestDto = z.infer<typeof CreateTestimonialSchema>;
//# sourceMappingURL=create.testimonial.dto.d.ts.map