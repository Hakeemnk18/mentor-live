import { inject, injectable } from "tsyringe";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import type { AvailableSlotView } from "../../faculty-slot/types/faculty.slot.type.js";
import type { IGetAvailableSlotsUseCase } from "./interfaces/get.available.slots.use-case.interface.js";

@injectable()
export class GetAvailableSlotsUseCase implements IGetAvailableSlotsUseCase {
  constructor(
    @inject("IFacultySlotRepository")
    private readonly _facultySlotRepository: IFacultySlotRepository,
  ) {}

  async execute(facultyId: string, variantId?: string): Promise<AvailableSlotView[]> {
    if (variantId) {
      return this._facultySlotRepository.getAvailableByFacultyAndVariant(facultyId, variantId);
    }
    // No variantId — return all available slots for this faculty (used by admin modals)
    return this._facultySlotRepository.getAllAvailableByFaculty(facultyId);
  }
}
