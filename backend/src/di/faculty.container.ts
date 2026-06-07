import { container } from "tsyringe";
import type { IFacultyRepository } from "../modules/faculty/repository/faculty.repository.interface.js";
import { FacultyRepository } from "../modules/faculty/repository/faculty.repository.js";
import type { ICreateFacultyUseCase } from "../modules/faculty/use-cases/interfaces/create.faculty.use-case.interface.js";
import { CreateFacultyUseCase } from "../modules/faculty/use-cases/create.faculty.use-case.js";
import type { IGetAllFacultyForAdminUseCase } from "../modules/faculty/use-cases/interfaces/get.all.faculty.for.admin.use-case.interface.js";
import { GetAllFacultyForAdminUseCase } from "../modules/faculty/use-cases/get.all.faculty.for.admin.use-case.js";
import type { IGetFacultyDetailsUseCase } from "../modules/faculty/use-cases/interfaces/get.faculty.details.use-case.interface.js";
import { GetFacultyDetailsUseCase } from "../modules/faculty/use-cases/get.faculty.details.use-case.js";
import type { IEditFacultyUseCase } from "../modules/faculty/use-cases/interfaces/edit.faculty.use-case.interface.js";
import { EditFacultyUseCase } from "../modules/faculty/use-cases/edit.faculty.use-case.js";
import type { IFacultyAddSlotUseCase } from "../modules/faculty/use-cases/interfaces/faculty.add.slot.use-case.interface.js";
import { FacultyAddSlotUseCase } from "../modules/faculty/use-cases/faculty.add.slot.use-case.interface.js";
import type { IFacultyAddChapterSlotUseCase } from "../modules/faculty/use-cases/interfaces/faculty.add.chapter.slot.use-case.interface.js";
import { FacultyAddChapterSlotUseCase } from "../modules/faculty/use-cases/faculty.add.chapter.slot.use-case.js";
import type { IFindFacultyByChapterUseCase } from "../modules/faculty/use-cases/interfaces/find.faculty.by.chapter.use-case.interface.js";
import { FindFacultyByChapterUseCase } from "../modules/faculty/use-cases/find.faculty.by.chapter.use-case.js";
import type { IFindFacultyByClassAndSyllabusUseCaseUseCase } from "../modules/faculty/use-cases/interfaces/find.faculty.by.class.and.syllabus.use-case.interface.js";
import { FindFacultyByClassAndSyllabusUseCaseUseCase } from "../modules/faculty/use-cases/find.faculty.by.class.and.syllabus.use-case.js";
import type { IGetFacultyDetailsByChapterUseCase } from "../modules/faculty/use-cases/interfaces/get.faculty.details.by.chapter.use-case.interface.js";
import { GetFacultyDetailsByChapterUseCase } from "../modules/faculty/use-cases/get.faculty.details.by.chapter.use-case.js";
import type { IGetFacultyDetailsBySlotUseCase } from "../modules/faculty/use-cases/interfaces/get.faculty.details.by.slot.use-case.interface.js";
import { GetFacultyDetailsBySlotUseCase } from "../modules/faculty/use-cases/get.faculty.details.by.slot.use-case.js";
import type { IBlockFacultyUseCase } from "../modules/faculty/use-cases/interfaces/block.faculty.use-case.interface.js";
import { BlockFacultyUseCase } from "../modules/faculty/use-cases/block.faculty.use-case.js";
import type { IUnblockFacultyUseCase } from "../modules/faculty/use-cases/interfaces/unblock.faculty.interface.js";
import { UnblockFacultyUseCase } from "../modules/faculty/use-cases/unblock.faculty.js";
import type { ISetFacultySlotAvailabilityUseCase } from "../modules/faculty/use-cases/interfaces/set.faculty.slot.availability.usecase.interface.js";
import { SetFacultySlotAvailabilityUseCase } from "../modules/faculty/use-cases/set.faculty.slot.availability.usecase.js";
import type { IGetAvailableSlotsUseCase } from "../modules/faculty/use-cases/interfaces/get.available.slots.use-case.interface.js";
import { GetAvailableSlotsUseCase } from "../modules/faculty/use-cases/get.available.slots.use-case.js";
import type { IGetUserSlotDetailsUseCase } from "../modules/faculty/use-cases/interfaces/get.user.slot.details.interface.js";
import { GetUserSlotDetailsUseCase } from "../modules/faculty/use-cases/get.user.slot.details.js";
import type { IGetFacultyPublicProfileUseCase } from "../modules/faculty/use-cases/interfaces/get.faculty.public.profile.use-case.interface.js";
import { GetFacultyPublicProfileUseCase } from "../modules/faculty/use-cases/get.faculty.public.profile.use-case.js";
import type { IGetFeaturedFacultyUseCase } from "../modules/faculty/use-cases/interfaces/get.featured.faculty.use-case.interface.js";
import { GetFeaturedFacultyUseCase } from "../modules/faculty/use-cases/get.featured.faculty.use-case.js";

export const registerFacultyDependencies = () => {
  container.register<IFacultyRepository>("IFacultyRepository", {
    useClass: FacultyRepository,
  });

  container.register<ICreateFacultyUseCase>("ICreateFacultyUseCase", {
    useClass: CreateFacultyUseCase,
  });

  container.register<IGetAllFacultyForAdminUseCase>("IGetAllFacultyForAdminUseCase", {
    useClass: GetAllFacultyForAdminUseCase,
  });

  container.register<IGetFacultyDetailsUseCase>("IGetFacultyDetailsUseCase", {
    useClass: GetFacultyDetailsUseCase,
  });

  container.register<IEditFacultyUseCase>("IEditFacultyUseCase", {
    useClass: EditFacultyUseCase,
  });

  container.register<IFacultyAddSlotUseCase>("IFacultyAddSlotUseCase", {
    useClass: FacultyAddSlotUseCase,
  });

  container.register<IFacultyAddChapterSlotUseCase>("IFacultyAddChapterSlotUseCase", {
    useClass: FacultyAddChapterSlotUseCase,
  });

  container.register<IFindFacultyByChapterUseCase>("IFindFacultyByChapterUseCase", {
    useClass: FindFacultyByChapterUseCase,
  });

  container.register<IFindFacultyByClassAndSyllabusUseCaseUseCase>("IFindFacultyByClassAndSyllabusUseCaseUseCase", {
    useClass: FindFacultyByClassAndSyllabusUseCaseUseCase,
  });

  container.register<IGetFacultyDetailsByChapterUseCase>("IGetFacultyDetailsByChapterUseCase", {
    useClass: GetFacultyDetailsByChapterUseCase,
  });

  container.register<IGetFacultyDetailsBySlotUseCase>("IGetFacultyDetailsBySlotUseCase", {
    useClass: GetFacultyDetailsBySlotUseCase,
  });

  container.register<IBlockFacultyUseCase>("IBlockFacultyUseCase", {
    useClass: BlockFacultyUseCase,
  });

  container.register<IUnblockFacultyUseCase>("IUnblockFacultyUseCase", {
    useClass: UnblockFacultyUseCase,
  });

  container.register<ISetFacultySlotAvailabilityUseCase>("ISetFacultySlotAvailabilityUseCase", {
    useClass: SetFacultySlotAvailabilityUseCase,
  });

  container.register<IGetAvailableSlotsUseCase>("IGetAvailableSlotsUseCase", {
    useClass: GetAvailableSlotsUseCase,
  });

  container.register<IGetUserSlotDetailsUseCase>("IGetUserSlotDetailsUseCase", {
    useClass: GetUserSlotDetailsUseCase,
  });

  container.register<IGetFacultyPublicProfileUseCase>("IGetFacultyPublicProfileUseCase", {
    useClass: GetFacultyPublicProfileUseCase,
  });

  container.register<IGetFeaturedFacultyUseCase>("IGetFeaturedFacultyUseCase", {
    useClass: GetFeaturedFacultyUseCase,
  });
};
