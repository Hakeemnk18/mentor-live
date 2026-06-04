import type { SlotProps } from "../../types/faculty.type.js";
export interface IGetUserSlotDetailsUseCase {
    execute(facultyId: string, slotId: string): Promise<SlotProps | null>;
}
//# sourceMappingURL=get.user.slot.details.interface.d.ts.map