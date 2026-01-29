import { z } from "zod";

export const CreateTestimonialSchema = z.object({
  author: z.string().trim().min(1, "Testimonial author is required"),

  designation: z.string().trim().min(1, "Testimonial designation is required"),

  comment: z.string().trim().min(5).max(500),
});

export type CreateTestimonialRequestDto = z.infer<
  typeof CreateTestimonialSchema
>;