import type { BookingStatusDistribution } from "../../type/analysis.type.js";

export interface IGetBookingStatusDistributionUseCase {
  execute(): Promise<BookingStatusDistribution>;
}
