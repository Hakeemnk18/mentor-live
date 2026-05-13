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
import type { IConfirmChapterPoolingBookingUseCase } from "../modules/booking/use-cases/interfaces/confirm.chapter.pooling.booking.interface.js";
import { ConfirmChapterPoolingBookingUseCase } from "../modules/booking/use-cases/confirm.chapter.pooling.booking.js";
import type { IRemoveStudentFromPoolingUseCase } from "../modules/booking/use-cases/interfaces/remove.student.from.pooling.use-case.interface.js";
import { RemoveStudentFromPoolingUseCase } from "../modules/booking/use-cases/remove.student.from.pooling.use-case.js";
import type { IGetSlotBookingDetailsUseCase } from "../modules/booking/use-cases/interfaces/get.slot.booking.details.use-case.interface.js";
import { GetSlotBookingDetailsUseCase } from "../modules/booking/use-cases/get.slot.booking.details.use-case.js";
import type { IGetChapterBookingDetailsUseCase } from "../modules/booking/use-cases/interfaces/get.chapter.booking.details.use-case.interface.js";
import { GetChapterBookingDetailsUseCase } from "../modules/booking/use-cases/get.chapter.booking.details.use-case.js";
import type { IGetAllBookingUseCase } from "../modules/booking/use-cases/interfaces/get.all.booking.use.case.interface.js";
import { GetAllBookingUseCase } from "../modules/booking/use-cases/get.all.booking.use.case.js";

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

  container.register<IConfirmChapterOneToOneBookingUseCase>(
    "IConfirmChapterOneToOneBookingUseCase",
    {
      useClass: ConfirmChapterOneToOneBookingUseCase,
    },
  );

  container.register<IConfirmOneToOneBookingUseCase>(
    "IConfirmOneToOneBookingUseCase",
    {
      useClass: ConfirmOneToOneBookingUseCase,
    },
  );

  container.register<IConfirmPoolingBookingUseCase>(
    "IConfirmPoolingBookingUseCase",
    { useClass: ConfirmPoolingBookingUseCase },
  );

  container.register<IConfirmChapterPoolingBookingUseCase>(
    "IConfirmChapterPoolingBookingUseCase",
    { useClass: ConfirmChapterPoolingBookingUseCase },
  );

  container.register<IRemoveStudentFromPoolingUseCase>(
    "IRemoveStudentFromPoolingUseCase",
    { useClass: RemoveStudentFromPoolingUseCase },
  );

  container.register<IGetSlotBookingDetailsUseCase>(
    "IGetSlotBookingDetailsUseCase",
    { useClass: GetSlotBookingDetailsUseCase },
  );

  container.register<IGetChapterBookingDetailsUseCase>(
    "IGetChapterBookingDetailsUseCase",
    { useClass: GetChapterBookingDetailsUseCase },
  );

  container.register<IGetAllBookingUseCase>("IGetAllBookingUseCase", {
    useClass: GetAllBookingUseCase,
  });
};
