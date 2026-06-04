import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { IGetChaptersForUserUseCase } from "./interfaces/get.all.for.user.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { ChapterListQueryDto } from "../dtos/get.chapter.dto.js";
export declare class GetChaptersForUserUseCase implements IGetChaptersForUserUseCase {
    private readonly _chapterRepository;
    private readonly _subjectVariantRepository;
    constructor(_chapterRepository: IChapterRepository, _subjectVariantRepository: ISubjectVariantRepository);
    execute(dto: ChapterListQueryDto): Promise<{
        id: string;
        name: string;
        price: number;
        icon: string;
    }[]>;
}
//# sourceMappingURL=get.all.for.user.use-case.d.ts.map