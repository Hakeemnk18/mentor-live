import { inject, injectable } from "tsyringe";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import type { FacultySlot } from "../../faculty-slot/entities/faculty.slot.entity.js";
import type { IGetUserSlotDetailsUseCase } from "./interfaces/get.user.slot.details.interface.js";

@injectable()
export class GetUserSlotDetailsUseCase implements IGetUserSlotDetailsUseCase {
  constructor(
    @inject("IFacultySlotRepository")
    private readonly _facultySlotRepository: IFacultySlotRepository,
  ) {}

  async execute(
    _facultyId: string,
    slotId: string,
  ): Promise<FacultySlot | null> {
    return this._facultySlotRepository.findById(slotId);
  }
}
