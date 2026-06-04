import { container } from "tsyringe";
import { ChapterRepository } from "../modules/chapter/repositories/chapter.repository.js";
import { CreateChapterUseCase } from "../modules/chapter/use-cases/create.chapter.use-case.js";
import { EditChapterUseCase } from "../modules/chapter/use-cases/edit.chapter.use-case.js";
import { GetChaptersForUserUseCase } from "../modules/chapter/use-cases/get.all.for.user.use-case.js";
import { GetChaptersForAdminUseCase } from "../modules/chapter/use-cases/get.all.for.admin.use-case.js";
import { BlockChapterUseCase } from "../modules/chapter/use-cases/block.chapter.use-case.js";
import { UnblockChapterUseCase } from "../modules/chapter/use-cases/unblock.chapter.use-case.js";
import { GetChapterNameUseCase } from "../modules/chapter/use-cases/get.chapter.name.use-case.js";
export const registerChapterDependencies = () => {
    container.register("IChapterRepository", {
        useClass: ChapterRepository,
    });
    container.register("ICreateChapterUseCase", {
        useClass: CreateChapterUseCase,
    });
    container.register("IEditChapterUseCase", {
        useClass: EditChapterUseCase,
    });
    container.register("IGetChaptersForUserUseCase", {
        useClass: GetChaptersForUserUseCase,
    });
    container.register("IGetChaptersForAdminUseCase", {
        useClass: GetChaptersForAdminUseCase,
    });
    container.register("IBlockChapterUseCase", {
        useClass: BlockChapterUseCase,
    });
    container.register("IUnblockChapterUseCase", {
        useClass: UnblockChapterUseCase,
    });
    container.register("IGetChapterNameUseCase", {
        useClass: GetChapterNameUseCase,
    });
};
//# sourceMappingURL=chapter.container.js.map