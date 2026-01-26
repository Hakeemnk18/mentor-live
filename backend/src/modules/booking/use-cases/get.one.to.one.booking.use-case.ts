import { inject, injectable } from "tsyringe";
import type { GetAllOneToOneBookingDto } from "../dto/get.all.one.to.one.dto.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { AdminBookingView } from "../type/booking.type.js";
import type { IGetOneToOneBookingUseCase } from "./interfaces/get.one.to.one.booking.use-case.interface.js";

@injectable()
export class GetOneToOneBookingUseCase implements IGetOneToOneBookingUseCase {
    constructor(
        @inject("IBookingRepository")
        private readonly _bookingRepository: IBookingRepository,
    ){}
      

    async execute(dto: GetAllOneToOneBookingDto): Promise<{ data: AdminBookingView[]; total: number; }> {
        return await this._bookingRepository.findAllOneToOneBooking(dto)
    }
}