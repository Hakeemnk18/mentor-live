import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { CreateChapterRequestDto } from "../dtos/create.chapter.dto.js";
import type { IEditChapterUseCase } from "./interfaces/edit.chapter.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
export declare class EditChapterUseCase implements IEditChapterUseCase {
    private readonly _chapterRepository;
    private readonly _subjectVariantRepository;
    constructor(_chapterRepository: IChapterRepository, _subjectVariantRepository: ISubjectVariantRepository);
    execute(id: string, dto: CreateChapterRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.chapter.use-case.d.ts.map