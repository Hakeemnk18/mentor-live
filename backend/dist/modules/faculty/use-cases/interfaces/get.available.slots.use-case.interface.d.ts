import type { AvailableSlots } from "../../types/faculty.type.js";
export interface IGetAvailableSlotsUseCase {
    execute(facultyId: string): Promise<AvailableSlots[]>;
}
//# sourceMappingURL=get.available.slots.use-case.interface.d.ts.map