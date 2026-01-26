import type { GetAdminPoolingStudentsDto } from "../../dto/get.pooling.students.dto.js";
import type { AdminPoolingStudentRaw } from "../../type/booking.type.js";

export interface IGetPoolingStudentsUseCase {
    execute(dto: GetAdminPoolingStudentsDto): Promise<AdminPoolingStudentRaw[]>
}