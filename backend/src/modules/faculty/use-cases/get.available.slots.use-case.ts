import { inject, injectable } from "tsyringe";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { AvailableSlots } from "../types/faculty.type.js";
import type { IGetAvailableSlotsUseCase } from "./interfaces/get.available.slots.use-case.interface.js";

@injectable()
export class GetAvailableSlotsUseCase implements IGetAvailableSlotsUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,
  ) {}

    async execute(facultyId: string): Promise<AvailableSlots[]> {
        return await this._facultyRepository.getAllAvailableSlots(facultyId);
    }
}