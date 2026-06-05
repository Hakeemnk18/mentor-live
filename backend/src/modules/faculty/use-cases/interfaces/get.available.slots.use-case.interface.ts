import type { AvailableSlotView } from "../../../faculty-slot/types/faculty.slot.type.js";

export interface IGetAvailableSlotsUseCase {
  execute(facultyId: string, variantId: string): Promise<AvailableSlotView[]>;
}
