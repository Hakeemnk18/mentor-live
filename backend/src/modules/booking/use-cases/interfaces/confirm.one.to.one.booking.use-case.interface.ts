import type { ConfirmOneToOneBookingDto } from "../../dto/confirm.one.to.one.booking.dto.js";

export interface IConfirmOneToOneBookingUseCase {
  execute(dto: ConfirmOneToOneBookingDto): Promise<void>;
}