import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { SlotProps } from "../types/faculty.type.js";
import type { IGetUserSlotDetailsUseCase } from "./interfaces/get.user.slot.details.interface.js";

import { inject, injectable } from "tsyringe";


@injectable()
export class GetUserSlotDetailsUseCase implements IGetUserSlotDetailsUseCase {
    constructor(
        @inject("IFacultyRepository")
        private readonly facultyRepository: IFacultyRepository
    ) { }

    async execute(facultyId: string, slotId: string): Promise<SlotProps | null> {
        const slot = await this.facultyRepository.getSlot(facultyId, slotId);
        return slot;
    }
}