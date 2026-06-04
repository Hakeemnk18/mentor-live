import { container } from "tsyringe";
import { BookingRepository } from "../modules/booking/repositories/booking.repository.js";
import { CreateBookingUseCase } from "../modules/booking/use-cases/crete.booking.use-case.js";
import { GetOneToOneBookingUseCase } from "../modules/booking/use-cases/get.one.to.one.booking.use-case.js";
import { GetPoolingBookingUseCase } from "../modules/booking/use-cases/get.pooling.booking.use-case.js";
import { GetPoolingStudentsUseCase } from "../modules/booking/use-cases/get.pooling.students.use-case.js";
import { ConfirmChapterOneToOneBookingUseCase } from "../modules/booking/use-cases/confirm.chapter.one.to.one.use-case.js";
import { ConfirmOneToOneBookingUseCase } from "../modules/booking/use-cases/confirm.one.to.one.booking.use-case.js";
import { ConfirmPoolingBookingUseCase } from "../modules/booking/use-cases/confirm.pooling.booking.use-case.js";
import { ConfirmChapterPoolingBookingUseCase } from "../modules/booking/use-cases/confirm.chapter.pooling.booking.js";
import { RemoveStudentFromPoolingUseCase } from "../modules/booking/use-cases/remove.student.from.pooling.use-case.js";
import { GetSlotBookingDetailsUseCase } from "../modules/booking/use-cases/get.slot.booking.details.use-case.js";
import { GetChapterBookingDetailsUseCase } from "../modules/booking/use-cases/get.chapter.booking.details.use-case.js";
import { GetAllBookingUseCase } from "../modules/booking/use-cases/get.all.booking.use.case.js";
export const registerBookingDependencies = () => {
    container.register("IBookingRepository", {
        useClass: BookingRepository,
    });
    container.register("ICreateBookingUseCase", {
        useClass: CreateBookingUseCase,
    });
    container.register("IGetOneToOneBookingUseCase", {
        useClass: GetOneToOneBookingUseCase,
    });
    container.register("IGetPoolingBookingUseCase", {
        useClass: GetPoolingBookingUseCase,
    });
    container.register("IGetPoolingStudentsUseCase", {
        useClass: GetPoolingStudentsUseCase,
    });
    container.register("IConfirmChapterOneToOneBookingUseCase", {
        useClass: ConfirmChapterOneToOneBookingUseCase,
    });
    container.register("IConfirmOneToOneBookingUseCase", {
        useClass: ConfirmOneToOneBookingUseCase,
    });
    container.register("IConfirmPoolingBookingUseCase", { useClass: ConfirmPoolingBookingUseCase });
    container.register("IConfirmChapterPoolingBookingUseCase", { useClass: ConfirmChapterPoolingBookingUseCase });
    container.register("IRemoveStudentFromPoolingUseCase", { useClass: RemoveStudentFromPoolingUseCase });
    container.register("IGetSlotBookingDetailsUseCase", { useClass: GetSlotBookingDetailsUseCase });
    container.register("IGetChapterBookingDetailsUseCase", { useClass: GetChapterBookingDetailsUseCase });
    container.register("IGetAllBookingUseCase", {
        useClass: GetAllBookingUseCase,
    });
};
//# sourceMappingURL=booking.container.js.map