import { inject, injectable } from "tsyringe";
import type { GetAllOneToOneBookingDto } from "../dto/get.all.one.to.one.dto.js";
import type { AdminPoolingView } from "../type/booking.type.js";
import type { IGetPoolingBookingUseCase } from "./interfaces/get.pooling.booking.use-case.interfaces.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";

@injectable()
export class GetPoolingBookingUseCase implements IGetPoolingBookingUseCase {
    constructor(
        @inject("IBookingRepository")
        private readonly _bookingRepository: IBookingRepository,
    ){}
    async execute(dto: GetAllOneToOneBookingDto): Promise<{ data: AdminPoolingView[]; total: number; }> {
        return await this._bookingRepository.findAllPoolingBooking(dto)
    }
}