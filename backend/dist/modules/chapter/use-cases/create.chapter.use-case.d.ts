import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { CreateChapterRequestDto } from "../dtos/create.chapter.dto.js";
import type { ICreateChapterUseCase } from "./interfaces/create.chapter.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
export declare class CreateChapterUseCase implements ICreateChapterUseCase {
    private readonly _chapterRepository;
    private readonly _subjectVariantRepository;
    constructor(_chapterRepository: IChapterRepository, _subjectVariantRepository: ISubjectVariantRepository);
    execute(dto: CreateChapterRequestDto): Promise<void>;
}
//# sourceMappingURL=create.chapter.use-case.d.ts.map