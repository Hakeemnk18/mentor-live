import { z } from "zod";
export declare const CreateBlogSchema: z.ZodObject<{
    author: z.ZodString;
    heading: z.ZodString;
    description: z.ZodString;
    content: z.ZodString;
    image: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
    }, z.core.$strip>>>;
    priority: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    topic: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateBlogRequestDto = z.infer<typeof CreateBlogSchema>;
//# sourceMappingURL=create.blog.dto.d.ts.map