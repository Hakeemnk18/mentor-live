import { container } from "tsyringe";
import { FacultyRepository } from "../modules/faculty/repository/faculty.repository.js";
import { CreateFacultyUseCase } from "../modules/faculty/use-cases/create.faculty.use-case.js";
import { GetAllFacultyForAdminUseCase } from "../modules/faculty/use-cases/get.all.faculty.for.admin.use-case.js";
import { GetFacultyDetailsUseCase } from "../modules/faculty/use-cases/get.faculty.details.use-case.js";
import { EditFacultyUseCase } from "../modules/faculty/use-cases/edit.faculty.use-case.js";
import { FacultyAddSlotUseCase } from "../modules/faculty/use-cases/faculty.add.slot.use-case.interface.js";
import { FacultyAddChapterSlotUseCase } from "../modules/faculty/use-cases/faculty.add.chapter.slot.use-case.js";
import { FindFacultyByChapterUseCase } from "../modules/faculty/use-cases/find.faculty.by.chapter.use-case.js";
import { FindFacultyByClassAndSyllabusUseCaseUseCase } from "../modules/faculty/use-cases/find.faculty.by.class.and.syllabus.use-case.js";
import { GetFacultyDetailsByChapterUseCase } from "../modules/faculty/use-cases/get.faculty.details.by.chapter.use-case.js";
import { GetFacultyDetailsBySlotUseCase } from "../modules/faculty/use-cases/get.faculty.details.by.slot.use-case.js";
import { BlockFacultyUseCase } from "../modules/faculty/use-cases/block.faculty.use-case.js";
import { UnblockFacultyUseCase } from "../modules/faculty/use-cases/unblock.faculty.js";
import { SetFacultySlotAvailabilityUseCase } from "../modules/faculty/use-cases/set.faculty.slot.availability.usecase.js";
import { GetAvailableSlotsUseCase } from "../modules/faculty/use-cases/get.available.slots.use-case.js";
import { GetUserSlotDetailsUseCase } from "../modules/faculty/use-cases/get.user.slot.details.js";
export const registerFacultyDependencies = () => {
    container.register("IFacultyRepository", {
        useClass: FacultyRepository,
    });
    container.register("ICreateFacultyUseCase", {
        useClass: CreateFacultyUseCase,
    });
    container.register("IGetAllFacultyForAdminUseCase", {
        useClass: GetAllFacultyForAdminUseCase,
    });
    container.register("IGetFacultyDetailsUseCase", {
        useClass: GetFacultyDetailsUseCase,
    });
    container.register("IEditFacultyUseCase", {
        useClass: EditFacultyUseCase,
    });
    container.register("IFacultyAddSlotUseCase", {
        useClass: FacultyAddSlotUseCase,
    });
    container.register("IFacultyAddChapterSlotUseCase", {
        useClass: FacultyAddChapterSlotUseCase,
    });
    container.register("IFindFacultyByChapterUseCase", {
        useClass: FindFacultyByChapterUseCase,
    });
    container.register("IFindFacultyByClassAndSyllabusUseCaseUseCase", {
        useClass: FindFacultyByClassAndSyllabusUseCaseUseCase,
    });
    container.register("IGetFacultyDetailsByChapterUseCase", {
        useClass: GetFacultyDetailsByChapterUseCase,
    });
    container.register("IGetFacultyDetailsBySlotUseCase", {
        useClass: GetFacultyDetailsBySlotUseCase,
    });
    container.register("IBlockFacultyUseCase", {
        useClass: BlockFacultyUseCase,
    });
    container.register("IUnblockFacultyUseCase", {
        useClass: UnblockFacultyUseCase,
    });
    container.register("ISetFacultySlotAvailabilityUseCase", {
        useClass: SetFacultySlotAvailabilityUseCase,
    });
    container.register("IGetAvailableSlotsUseCase", {
        useClass: GetAvailableSlotsUseCase,
    });
    container.register("IGetUserSlotDetailsUseCase", {
        useClass: GetUserSlotDetailsUseCase,
    });
};
//# sourceMappingURL=faculty.container.js.map