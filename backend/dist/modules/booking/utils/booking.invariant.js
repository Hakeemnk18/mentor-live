import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
export function validateBookingModeInvariant(booking) {
    if (booking.mode === "slot") {
        if (!booking.slotId ||
            booking.slotId.length !== 1) {
            throw new CustomError(ResponseMessages.BOOKING_SLOT_ID_INVALID, HttpStatusCode.BAD_REQUEST);
        }
        if (booking.chapterId) {
            throw new CustomError(ResponseMessages.BOOKING_CHAPTER_ID_INVALID, HttpStatusCode.BAD_REQUEST);
        }
    }
    if (booking.mode === "chapter") {
        if (!booking.chapterId) {
            throw new CustomError(ResponseMessages.BOOKING_CHAPTER_ID_INVALID, HttpStatusCode.BAD_REQUEST);
        }
        if (booking.slotId && booking.slotId.length > 0) {
            throw new CustomError(ResponseMessages.BOOKING_SLOT_ID_INVALID, HttpStatusCode.BAD_REQUEST);
        }
    }
}
//# sourceMappingURL=booking.invariant.js.map