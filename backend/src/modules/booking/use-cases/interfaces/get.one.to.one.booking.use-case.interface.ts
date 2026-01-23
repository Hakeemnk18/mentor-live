import type { GetAllOneToOneBookingDto } from "../../dto/get.all.one.to.one.dto.js";
import type { AdminBookingView } from "../../type/booking.type.js";

export interface IGetOneToOneBookingUseCase {
    execute(dto: GetAllOneToOneBookingDto): Promise<{data: AdminBookingView[], total: number}>
}