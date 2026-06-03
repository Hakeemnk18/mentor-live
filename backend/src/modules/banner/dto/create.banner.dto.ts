import { z } from "zod";

export const CreateBannerSchema = z
  .object({
    image: z.object({
      url: z.string().trim().min(1, "Banner image URL is required"),
      publicId: z.string().trim().min(1, "Banner image publicId is required"),
    }),

    description: z.string().trim().min(5).max(200),

    isShow: z.boolean().default(false),

    priority: z.number().int().min(1).max(5).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isShow && (data.priority === null || data.priority === undefined)) {
      ctx.addIssue({
        path: ["priority"],
        code: z.ZodIssueCode.custom,
        message: "Priority (1–5) is required when banner is set to visible",
      });
    }
  });

export type CreateBannerRequestDto = z.infer<typeof CreateBannerSchema>;
