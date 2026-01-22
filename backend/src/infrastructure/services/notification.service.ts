import { injectable } from "tsyringe";
import { twilioClient } from "../../config/twilio.js";
import { INotificationService } from "../../core/ports/notification.service.interface.js";

@injectable()
export class WhatsAppNotificationService
  implements INotificationService
{
  async sendBookingConfirmation(
    phoneNumber: string,
    bookingId: string
  ): Promise<void> {
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER!, // whatsapp:+14155238886
      to: `whatsapp:${phoneNumber}`,
      body: `✅ Booking confirmed.\nBooking ID: ${bookingId}`,
    });
  }
}