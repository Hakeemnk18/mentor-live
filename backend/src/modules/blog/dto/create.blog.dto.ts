import { z } from "zod";

export const CreateBlogSchema = z.object({
  author: z.string().trim().min(1, "Blog author is required"),

  heading: z.string().trim().min(5).max(200),

  description: z.string().trim().min(10).max(300),

  content: z.string().trim().min(20),

  image: z
    .object({
      url: z.string().trim().min(1, "Image URL is required"),
      publicId: z.string().trim().min(1, "Image publicId is required"),
    })
    .optional()
    .nullable(),

  priority: z.number().int().optional().nullable(),

  topic: z.string().trim().max(80).optional().nullable(),

  isFeatured: z.boolean().default(false),
});

export type CreateBlogRequestDto = z.infer<typeof CreateBlogSchema>;
