import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { SlotProps } from "../types/faculty.type.js";
import type { IGetUserSlotDetailsUseCase } from "./interfaces/get.user.slot.details.interface.js";
export declare class GetUserSlotDetailsUseCase implements IGetUserSlotDetailsUseCase {
    private readonly facultyRepository;
    constructor(facultyRepository: IFacultyRepository);
    execute(facultyId: string, slotId: string): Promise<SlotProps | null>;
}
//# sourceMappingURL=get.user.slot.details.d.ts.map