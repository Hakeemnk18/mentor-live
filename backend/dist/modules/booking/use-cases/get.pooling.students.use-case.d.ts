import type { GetAdminPoolingStudentsDto } from "../dto/get.pooling.students.dto.js";
import type { AdminPoolingStudentRaw } from "../type/booking.type.js";
import type { IGetPoolingStudentsUseCase } from "./interfaces/get.pooling.students.use-case.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
export declare class GetPoolingStudentsUseCase implements IGetPoolingStudentsUseCase {
    private readonly _bookingRepository;
    constructor(_bookingRepository: IBookingRepository);
    execute(dto: GetAdminPoolingStudentsDto): Promise<AdminPoolingStudentRaw[]>;
}
//# sourceMappingURL=get.pooling.students.use-case.d.ts.map