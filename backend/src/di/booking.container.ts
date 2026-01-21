import { container } from "tsyringe";
import type { IStudentRepository } from "../modules/student/repositories/student.repository.interface.js";
import { StudentRepository } from "../modules/student/repositories/student.repository.js";
import type { IBookingRepository } from "../modules/booking/repositories/booking.repository.interface.js";
import { BookingRepository } from "../modules/booking/repositories/booking.repository.js";
import type { ICreateBookingUseCase } from "../modules/booking/use-cases/interfaces/create.booking.use-case.interface.js";
import { CreateBookingUseCase } from "../modules/booking/use-cases/crete.booking.use-case.js";

export const registerBookingDependencies = () => {
  
    container.register<IBookingRepository>("IBookingRepository", {
        useClass: BookingRepository,
    });

    container.register<ICreateBookingUseCase>("ICreateBookingUseCase", {
        useClass: CreateBookingUseCase,
    });

};