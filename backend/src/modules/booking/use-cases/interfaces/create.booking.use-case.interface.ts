import type { CreateBookingRequestDto } from "../../dto/create.booking.dto.js";

export interface ICreateBookingUseCase {
  execute(dto: CreateBookingRequestDto): Promise<void>;
  
}