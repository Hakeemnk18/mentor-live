import { z } from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";

export const CreateChapterSchema = z.object({
  icon: z.object({
    url: z
      .string()
      .trim()
      .min(1, "Icon URL is required"),
    publicId: z
      .string()
      .trim()
      .min(1, "Icon publicId is required"),
  }),

  name: z
    .string()
    .trim()
    .min(2, "Chapter name must be at least 2 characters")
    .max(100, "Chapter name must be less than 100 characters"),

  price: z
    .number()
    .min(1, "Price must be greater than 1 "),

  subjectVariant: ObjectIdSchema,
});

export type CreateChapterRequestDto = z.infer<typeof CreateChapterSchema>;