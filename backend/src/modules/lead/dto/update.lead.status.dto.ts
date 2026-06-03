import { z } from "zod";

export const UpdateLeadStatusSchema = z.object({
  status: z.enum(["new", "contacted", "resolved"], {
    message: "Status must be 'new', 'contacted', or 'resolved'",
  }),
});

export type UpdateLeadStatusDto = z.infer<typeof UpdateLeadStatusSchema>;
