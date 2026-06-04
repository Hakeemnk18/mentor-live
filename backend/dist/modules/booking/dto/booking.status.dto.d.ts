import { z } from "zod";
export declare const BookingStatusEnum: z.ZodEnum<{
    interested: "interested";
    confirmed: "confirmed";
    cancelled: "cancelled";
    expired: "expired";
}>;
export declare const BookingModeEnum: z.ZodEnum<{
    slot: "slot";
    chapter: "chapter";
}>;
//# sourceMappingURL=booking.status.dto.d.ts.map