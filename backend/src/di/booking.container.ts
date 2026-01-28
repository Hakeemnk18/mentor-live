import { container } from "tsyringe";
import type { IBookingRepository } from "../modules/booking/repositories/booking.repository.interface.js";
import { BookingRepository } from "../modules/booking/repositories/booking.repository.js";
import type { ICreateBookingUseCase } from "../modules/booking/use-cases/interfaces/create.booking.use-case.interface.js";
import { CreateBookingUseCase } from "../modules/booking/use-cases/crete.booking.use-case.js";
import type { IGetOneToOneBookingUseCase } from "../modules/booking/use-cases/interfaces/get.one.to.one.booking.use-case.interface.js";
import { GetOneToOneBookingUseCase } from "../modules/booking/use-cases/get.one.to.one.booking.use-case.js";
import type { IGetPoolingBookingUseCase } from "../modules/booking/use-cases/interfaces/get.pooling.booking.use-case.interfaces.js";
import { GetPoolingBookingUseCase } from "../modules/booking/use-cases/get.pooling.booking.use-case.js";
import type { IGetPoolingStudentsUseCase } from "../modules/booking/use-cases/interfaces/get.pooling.students.use-case.interface.js";
import { GetPoolingStudentsUseCase } from "../modules/booking/use-cases/get.pooling.students.use-case.js";
import type { IConfirmChapterOneToOneBookingUseCase } from "../modules/booking/use-cases/interfaces/confirm.chapter.one.to.one.booking.use-case.interface.js";
import { ConfirmChapterOneToOneBookingUseCase } from "../modules/booking/use-cases/confirm.chapter.one.to.one.use-case.js";
import type { IConfirmOneToOneBookingUseCase } from "../modules/booking/use-cases/interfaces/confirm.one.to.one.booking.use-case.interface.js";
import { ConfirmOneToOneBookingUseCase } from "../modules/booking/use-cases/confirm.one.to.one.booking.use-case.js";
import type { IConfirmPoolingBookingUseCase } from "../modules/booking/use-cases/interfaces/confirm.pooling.booking.use-case.interface.js";
import { ConfirmPoolingBookingUseCase } from "../modules/booking/use-cases/confirm.pooling.booking.use-case.js";

export const registerBookingDependencies = () => {
  
    container.register<IBookingRepository>("IBookingRepository", {
        useClass: BookingRepository,
    });

    container.register<ICreateBookingUseCase>("ICreateBookingUseCase", {
        useClass: CreateBookingUseCase,
    });

    container.register<IGetOneToOneBookingUseCase>("IGetOneToOneBookingUseCase", {
        useClass: GetOneToOneBookingUseCase,
    });

    container.register<IGetPoolingBookingUseCase>("IGetPoolingBookingUseCase", {
        useClass: GetPoolingBookingUseCase,
    });

    container.register<IGetPoolingStudentsUseCase>("IGetPoolingStudentsUseCase", {
        useClass: GetPoolingStudentsUseCase,
    });

    container.register<IConfirmChapterOneToOneBookingUseCase>("IConfirmChapterOneToOneBookingUseCase", {
        useClass: ConfirmChapterOneToOneBookingUseCase,
    });

    container.register<IConfirmOneToOneBookingUseCase>("IConfirmOneToOneBookingUseCase", {
        useClass: ConfirmOneToOneBookingUseCase,
    });

    container.register<IConfirmPoolingBookingUseCase>("IConfirmPoolingBookingUseCase",
        { useClass: ConfirmPoolingBookingUseCase}
    )

};