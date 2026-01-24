import type { GetAllOneToOneBookingDto } from "../../dto/get.all.one.to.one.dto.js";
import type { AdminPoolingView } from "../../type/booking.type.js";

export interface IGetPoolingBookingUseCase {
    execute(dto: GetAllOneToOneBookingDto): Promise<{ data: AdminPoolingView[], total: number}>
}