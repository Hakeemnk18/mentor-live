import type { MarkBookingContactedDto } from "../../dto/mark.booking.contacted.dto.js";

export interface IMarkBookingContactedUseCase {
  execute(dto: MarkBookingContactedDto): Promise<void>;
}
