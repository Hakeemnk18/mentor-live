import { z } from "zod";
export declare const availabilitySchema: z.ZodObject<{
    isAvailable: z.ZodPipe<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>, z.ZodTransform<boolean, string | boolean>>;
}, z.core.$strip>;
//# sourceMappingURL=validate.is-availble.d.ts.map