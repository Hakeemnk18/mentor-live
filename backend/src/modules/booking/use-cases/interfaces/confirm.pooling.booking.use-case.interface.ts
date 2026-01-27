import type { ConfirmPoolingBookingDto } from "../../dto/confirm.pooling.booking.dto.js";

export interface IConfirmPoolingBookingUseCase {
  execute(dto: ConfirmPoolingBookingDto): Promise<void>;
}