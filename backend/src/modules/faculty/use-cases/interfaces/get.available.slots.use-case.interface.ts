import type { AvailableSlots } from "../../types/faculty.type.js";

export interface IGetAvailableSlotsUseCase {
  execute(facultyId: string): Promise<AvailableSlots[]>;
}