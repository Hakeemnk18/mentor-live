import { inject, injectable } from "tsyringe";
import type { IBookingRepository } from "../../booking/repositories/booking.repository.interface.js";
import type { AnalysisTableResponse } from "../type/analysis.type.js";
import type { IGetAnalysisTableUseCase } from "./interfaces/get.analysis.table.use-case.interface.js";

@injectable()
export class GetAnalysisTableUseCase implements IGetAnalysisTableUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(): Promise<AnalysisTableResponse> {
    const range = "1y";
    const topBookings =
      await this.bookingRepository.getTopBookingFaculties(range);

    const lowBookings =
      await this.bookingRepository.getLowBookingFaculties(range);

    const zeroBookings =
      await this.bookingRepository.getZeroBookingItems(range);

    return {
      topFacultyBookings: topBookings,
      lowFacultyBookings: lowBookings,
      zeroBookingItems: zeroBookings,
    };
  }
}
