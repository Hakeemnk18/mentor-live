import type { IGetChapterNameUseCase } from "./interfaces/get.chapter.name.use-case.interface.js";
import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
export declare class GetChapterNameUseCase implements IGetChapterNameUseCase {
    private readonly _chapterRepository;
    constructor(_chapterRepository: IChapterRepository);
    execute(): Promise<{
        id: string;
        name: string;
    }[]>;
}
//# sourceMappingURL=get.chapter.name.use-case.d.ts.map