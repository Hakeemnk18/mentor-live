import type { GetAllBookingDto } from "../../dto/get.all.booking.dto.js";

export interface IGetAllBookingUseCase {
  execute(dto: GetAllBookingDto): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
