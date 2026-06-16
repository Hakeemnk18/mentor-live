import type { FacultyDetailsViewForUser } from "../../types/faculty.type.js";

export interface IGetFacultyDetailsBySlotUseCase {
  /**
   * @param facultyId  - The faculty's MongoDB _id
   * @param variantId  - Required: the subject variant the student selected
   * @param slotId     - Optional: specific slot; omit to get first available
   */
  execute(
    facultyId: string,
    variantId: string,
    slotId?: string,
  ): Promise<FacultyDetailsViewForUser>;
}
