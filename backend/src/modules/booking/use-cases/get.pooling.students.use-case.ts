import { inject, injectable } from "tsyringe";
import type { GetAdminPoolingStudentsDto } from "../dto/get.pooling.students.dto.js";
import type { AdminPoolingStudentRaw } from "../type/booking.type.js";
import type { IGetPoolingStudentsUseCase } from "./interfaces/get.pooling.students.use-case.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";

@injectable()
export class GetPoolingStudentsUseCase implements IGetPoolingStudentsUseCase {
    constructor(
        @inject("IBookingRepository")
        private readonly _bookingRepository: IBookingRepository,
    ){}

    async execute(dto: GetAdminPoolingStudentsDto): Promise<AdminPoolingStudentRaw[]> {
        return await this._bookingRepository.findAdminPoolingStudents(dto)
    }
}