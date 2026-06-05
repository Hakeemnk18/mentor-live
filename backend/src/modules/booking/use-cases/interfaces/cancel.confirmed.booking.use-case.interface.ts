export interface ICancelConfirmedBookingUseCase {
  /**
   * Cancels a confirmed slot-mode booking and re-enables its slot
   * plus all cross-disabled sibling slots at the same time.
   */
  execute(bookingId: string): Promise<void>;
}
