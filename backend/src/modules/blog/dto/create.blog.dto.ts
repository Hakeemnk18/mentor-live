import { z } from "zod";

export const CreateBlogSchema = z.object({
  author: z.string().trim().min(1, "Blog author is required"),

  heading: z.string().trim().min(5).max(200),

  description: z.string().trim().min(10).max(300),

  content: z.string().trim().min(20),
});

export type CreateBlogRequestDto = z.infer<typeof CreateBlogSchema>;