import { z } from "zod";
export declare const CreateBannerSchema: z.ZodObject<{
    image: z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
    }, z.core.$strip>;
    description: z.ZodString;
    isShow: z.ZodDefault<z.ZodBoolean>;
    isClickable: z.ZodDefault<z.ZodBoolean>;
    buttonText: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type CreateBannerRequestDto = z.infer<typeof CreateBannerSchema>;
//# sourceMappingURL=create.banner.dto.d.ts.map