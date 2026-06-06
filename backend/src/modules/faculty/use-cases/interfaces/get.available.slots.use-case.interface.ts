import type { AvailableSlotView } from "../../../faculty-slot/types/faculty.slot.type.js";

export interface IGetAvailableSlotsUseCase {
  /** variantId optional — omit to get all available slots (admin use) */
  execute(facultyId: string, variantId?: string): Promise<AvailableSlotView[]>;
}
