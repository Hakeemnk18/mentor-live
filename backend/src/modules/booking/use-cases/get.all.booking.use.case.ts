// get.all.booking.use.case.ts
import { injectable, inject } from "tsyringe";
import type { GetAllBookingDto } from "../dto/get.all.booking.dto.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IGetAllBookingUseCase } from "./interfaces/get.all.booking.use.case.interface.js";

@injectable()
export class GetAllBookingUseCase implements IGetAllBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
  ) {}

  async execute(dto: GetAllBookingDto): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return await this._bookingRepository.findAllBookings(dto);
  }
}
