import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { IBlockChapterUseCase } from "./interfaces/block.chapter.use-case.interface.js";
export declare class BlockChapterUseCase implements IBlockChapterUseCase {
    private readonly _chapterRepository;
    constructor(_chapterRepository: IChapterRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=block.chapter.use-case.d.ts.map