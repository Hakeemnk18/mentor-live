import { z } from "zod";
export declare const AddSlotSchema: z.ZodObject<{
    slots: z.ZodArray<z.ZodObject<{
        time: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AddSlotRequestDto = z.infer<typeof AddSlotSchema>;
//# sourceMappingURL=add.slot.dto.d.ts.map