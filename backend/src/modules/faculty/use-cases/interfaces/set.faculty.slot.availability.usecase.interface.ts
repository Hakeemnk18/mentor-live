import type { SetSlotAvailabilityDto } from "../../types/faculty.type.js";

export interface ISetFacultySlotAvailabilityUseCase {
  execute(
    dto: SetSlotAvailabilityDto
  ): Promise<void>;
}