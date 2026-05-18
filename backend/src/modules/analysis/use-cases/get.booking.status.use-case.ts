// get.booking.status.distribution.use-case.ts

import { inject, injectable } from "tsyringe";
import type { IBookingRepository } from "../../booking/repositories/booking.repository.interface.js";
import type { BookingStatusDistribution } from "../type/analysis.type.js";
import type { BookingStatus } from "../../booking/type/booking.type.js";
import type { IGetBookingStatusDistributionUseCase } from "./interfaces/get.booking.status.use-case.interface.js";

@injectable()
export class GetBookingStatusDistributionUseCase implements IGetBookingStatusDistributionUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
  ) {}

  async execute(): Promise<BookingStatusDistribution> {
    const rawCounts = await this._bookingRepository.getBookingStatusCounts();

    const totalBookings = rawCounts.reduce((acc, curr) => acc + curr.count, 0);

    const statusOrder: BookingStatus[] = [
      "interested",
      "confirmed",
      "cancelled",
      "expired",
    ];

    const statuses = rawCounts
      .map((item) => ({
        status: item._id,
        count: item.count,
        percentage:
          totalBookings > 0
            ? Math.round((item.count / totalBookings) * 100)
            : 0,
      }))
      .sort(
        (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
      );

    return { totalBookings, statuses };
  }
}
