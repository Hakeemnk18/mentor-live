import z from "zod";
export const VerifyOtpSchema = z.object({
    phoneNumber: z
        .string()
        .trim()
        .regex(/^\+[1-9]\d{7,14}$/, {
        message: "Invalid phone number format (E.164 required)",
    }),
    otp: z
        .string()
        .trim()
        .regex(/^\d{6}$/, {
        message: "OTP must be a 6-digit number",
    })
        .optional(),
});
//# sourceMappingURL=otp.dto.js.map