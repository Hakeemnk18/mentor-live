import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import type { SlotProps } from "../../faculty/types/faculty.type.js";

export function validateSlotForBooking(
  currentSlot: SlotProps | null,
  bookingType: "oneToOne" | "pooling",
  studentId: string
): void {
  if (!currentSlot) {
    throw new CustomError(
      ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (bookingType === "pooling") {
    if (currentSlot.pool.length >= currentSlot.poolLimit) {
      throw new CustomError(
        ResponseMessages.POOL_ALREADY_FULL,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const alreadyInPool = currentSlot.pool.some(
      (id) => id === studentId
    );

    if (alreadyInPool) {
      throw new CustomError(
        ResponseMessages.STUDENT_ALREADY_EXISTS_IN_THIS_POOL,
        HttpStatusCode.BAD_REQUEST
      );
    }
  }
}
