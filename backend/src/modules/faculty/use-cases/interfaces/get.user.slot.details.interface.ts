import type { FacultySlot } from "../../../faculty-slot/entities/faculty.slot.entity.js";

export interface IGetUserSlotDetailsUseCase {
  execute(facultyId: string, slotId: string): Promise<FacultySlot | null>;
}
