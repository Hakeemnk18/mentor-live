import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { RemoveUserFromPoolDto } from "../dto/remove.student.from.pooling.dto.js";
import type { IRemoveStudentFromPoolingUseCase } from "./interfaces/remove.student.from.pooling.use-case.interface.js";
export declare class RemoveStudentFromPoolingUseCase implements IRemoveStudentFromPoolingUseCase {
    private readonly _bookingRepository;
    private readonly _facultyRepository;
    constructor(_bookingRepository: IBookingRepository, _facultyRepository: IFacultyRepository);
    execute(dto: RemoveUserFromPoolDto): Promise<void>;
}
//# sourceMappingURL=remove.student.from.pooling.use-case.d.ts.map