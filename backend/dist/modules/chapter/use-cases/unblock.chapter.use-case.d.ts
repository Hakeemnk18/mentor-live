import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { IUnblockChapterUseCase } from "./interfaces/unblock.chapter.use-case.interface.js";
export declare class UnblockChapterUseCase implements IUnblockChapterUseCase {
    private readonly _chapterRepository;
    constructor(_chapterRepository: IChapterRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=unblock.chapter.use-case.d.ts.map