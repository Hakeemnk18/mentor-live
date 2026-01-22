export abstract class INotificationService {
  abstract sendBookingConfirmation(
    phoneNumber: string,
    bookingId: string
  ): Promise<void>;
}