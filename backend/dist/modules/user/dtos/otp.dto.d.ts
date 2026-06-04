import z from "zod";
export declare const VerifyOtpSchema: z.ZodObject<{
    phoneNumber: z.ZodString;
    otp: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export type VerifyOtpRequestDto = z.infer<typeof VerifyOtpSchema>;
//# sourceMappingURL=otp.dto.d.ts.map