import { z } from "zod";

export const CreateBannerSchema = z.object({
  image: z.object({
    url: z.string().trim().min(1, "Banner image URL is required"),
    publicId: z.string().trim().min(1, "Banner image publicId is required"),
  }),

  description: z.string().trim().min(5).max(200),

  priority: z.number().int().min(1).max(5),
});

export type CreateBannerRequestDto = z.infer<typeof CreateBannerSchema>;