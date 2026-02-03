import { z } from "zod";

export const availabilitySchema = z.object({
  isAvailable: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (val === true || val === "true") return true;
      if (val === false || val === "false") return false;
      throw new Error("isAvailable must be 'true' or 'false'");
    }),
});