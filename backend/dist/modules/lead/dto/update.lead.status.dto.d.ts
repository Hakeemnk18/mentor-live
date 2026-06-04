import { z } from "zod";
export declare const UpdateLeadStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        new: "new";
        contacted: "contacted";
        resolved: "resolved";
    }>;
}, z.core.$strip>;
export type UpdateLeadStatusDto = z.infer<typeof UpdateLeadStatusSchema>;
//# sourceMappingURL=update.lead.status.dto.d.ts.map