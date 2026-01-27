// import { inject, injectable } from "tsyringe";

// @injectable()
// export class ConfirmPoolingBookingUseCase
//   implements IConfirmPoolingBookingUseCase {

//   constructor(
//     @inject("IBookingRepository")
//     private readonly bookingRepo: IBookingRepository,
//   ) {}

//   async execute(dto: ConfirmPoolingBookingDto): Promise<void> {
//     const bookings = await this.bookingRepo.findByIds(dto.bookingIds);

//     if (bookings.length !== dto.bookingIds.length) {
//       throw new CustomError(
//         ResponseMessages.BOOKING_NOT_FOUND,
//         HttpStatusCode.NOT_FOUND
//       );
//     }

//     const first = bookings[0];

//     for (const booking of bookings) {
//       if (booking.type !== "pooling") {
//         throw new CustomError(
//           ResponseMessages.INVALID_BOOKING_TYPE,
//           HttpStatusCode.BAD_REQUEST
//         );
//       }

//       if (booking.status !== "interested") {
//         throw new CustomError(
//           ResponseMessages.INVALID_BOOKING_STATE,
//           HttpStatusCode.BAD_REQUEST
//         );
//       }

//       // enforce same pool (CRITICAL)
//       if (
//         booking.facultyId !== first.facultyId ||
//         booking.mode !== first.mode ||
//         String(booking.slotId) !== String(first.slotId) ||
//         String(booking.chapterId) !== String(first.chapterId)
//       ) {
//         throw new CustomError(
//           ResponseMessages.INVALID_POOL_GROUP,
//           HttpStatusCode.BAD_REQUEST
//         );
//       }
//     }

//     // bulk update
//     await this.bookingRepo.confirmPoolingBookings(dto.bookingIds);
//   }
// }