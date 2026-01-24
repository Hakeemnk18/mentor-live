import { container } from "tsyringe";
import type { IBookingRepository } from "../modules/booking/repositories/booking.repository.interface.js";
import { BookingRepository } from "../modules/booking/repositories/booking.repository.js";
import type { ICreateBookingUseCase } from "../modules/booking/use-cases/interfaces/create.booking.use-case.interface.js";
import { CreateBookingUseCase } from "../modules/booking/use-cases/crete.booking.use-case.js";
import type { IGetOneToOneBookingUseCase } from "../modules/booking/use-cases/interfaces/get.one.to.one.booking.use-case.interface.js";
import { GetOneToOneBookingUseCase } from "../modules/booking/use-cases/get.one.to.one.booking.use-case.js";
import type { IGetPoolingBookingUseCase } from "../modules/booking/use-cases/interfaces/get.pooling.booking.use-case.interfaces.js";
import { GetPoolingBookingUseCase } from "../modules/booking/use-cases/get.pooling.booking.use-case.js";

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
};